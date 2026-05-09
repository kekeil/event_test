# Event API (backend)

API REST de gestion d’évènements avec inscriptions en ligne, contrôle de capacité, authentification admin par JWT et erreurs au format RFC 7807 (`application/problem+json`).

## Stack

- Java **21**, Spring Boot **4.0.6**, Maven
- Persistance : Spring Data JPA, Hibernate, **H2** en mémoire (`ddl-auto=update`, pas de Flyway/Liquibase)
- Sécurité : Spring Security stateless, **JWT** (HS256, secret Base64 ≥ 32 octets décodés)
- Documentation : **springdoc-openapi** (Swagger UI)
- Mail : **Spring Mail** (optionnel, désactivé par défaut via `app.mail.enabled=false`)

## Prérequis

- **JDK 21**
- **Maven** ou le wrapper `./mvnw` fourni dans ce dossier

## Lancement local

```bash
cd backend
./mvnw spring-boot:run
```

Sous Windows : `.\mvnw.cmd spring-boot:run`

- API : `http://localhost:8080`
- Swagger UI : `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON : `http://localhost:8080/v3/api-docs`
- Console H2 : `http://localhost:8080/h2-console`  
  - JDBC URL : `jdbc:h2:mem:eventdb`  
  - User : `sa`  
  - Mot de passe : *(vide)*

## Compte administrateur par défaut

Au premier démarrage, si aucun utilisateur n’existe, un admin est créé (voir logs WARN) :

- Email : `admin@event.local`
- Mot de passe : `Admin123!`

**À changer immédiatement** en environnement réel (variables `ADMIN_EMAIL` / `ADMIN_PASSWORD` ou propriétés `app.admin.*`).

## Variables d’environnement (principales)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `SERVER_PORT` | Port HTTP | `8080` |
| `JWT_SECRET` | Secret JWT encodé en **Base64** (≥ 32 octets une fois décodé) | *(valeur de dev dans `application.properties`)* |
| `ADMIN_EMAIL` | Email du compte admin seedé | `admin@event.local` |
| `ADMIN_PASSWORD` | Mot de passe en clair du seed (hashé au démarrage) | `Admin123!` |
| `CORS_ALLOWED_ORIGINS` | Origines CORS autorisées, séparées par des virgules | `http://localhost:3000` |
| `MAIL_ENABLED` | `true` pour activer l’envoi réel des mails | `false` |
| `MAIL_FROM` | Adresse expéditeur | `no-reply@event.local` |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | Paramètres SMTP (ex. Gmail / relais Coolify) | Voir `application.properties` |

## Exemples cURL

**Login admin**

```bash
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@event.local\",\"password\":\"Admin123!\"}"
```

**Créer un évènement (JWT requis)**

```bash
TOKEN="<coller le token>"
curl -s -X POST http://localhost:8080/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Meetup\",\"description\":\"\",\"date\":\"2030-01-15T18:00:00Z\",\"location\":\"Paris\",\"capacity\":2}"
```

**Lister les évènements (public)**

```bash
curl -s "http://localhost:8080/api/events?page=0&limit=10&search=meetup&date=2030-01-15"
```

**S’inscrire (public)**

```bash
curl -s -D - -X POST http://localhost:8080/api/events/<EVENT_ID>/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Aminata\",\"lastName\":\"Ouedraogo\",\"email\":\"aminata@example.com\"}"
```

**Capacité atteinte (422)**

Créer un évènement avec `capacity: 1`, effectuer une première inscription puis retenter avec un autre email : la réponse est `422` avec le code `CAPACITY_REACHED`.

**Email déjà inscrit (409)**

Réutiliser le même email sur le même évènement : `409` avec `DUPLICATE_EMAIL`.

## Docker (image backend seule)

Le `Dockerfile` utilise l’image **Maven** pour compiler (le dépôt ne versionne pas `maven-wrapper.jar`).

```bash
cd backend
docker build -t event-api .
docker run --rm -p 8080:8080 \
  -e JWT_SECRET=Y2hhbmdlLW1lLWluLXByb2QtdGhpcy1pcy1hLXNlY3JldC1iYXNlNjQta2V5LTMyLWJ5dGVz \
  event-api
```

## Docker Compose (racine du repo)

```bash
docker compose up --build
```

Démarre le backend (`8080`) et le frontend Next.js (`3000`) avec `NEXT_PUBLIC_API_BASE_URL` pointant par défaut sur `http://localhost:8080`.

## Déploiement (Coolify)

- Dockerfile : `backend/Dockerfile`
- Exposer le port **8080**
- Définir au minimum `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ALLOWED_ORIGINS`, et les variables mail si `MAIL_ENABLED=true`.

## Hypothèses et interprétations

- **Concurrence** : la vérification capacité + unicité email est faite en lecture puis écriture classique JPA. En production, prévoir par exemple un verrou pessimiste (`@Lock(PESSIMISTIC_WRITE)` sur l’agrégat évènement), une contrainte DB + gestion d’exception, ou un flux applicatif avec retry idempotent.
- **Mail** : désactivé par défaut pour éviter d’exposer des secrets SMTP dans un dépôt public ; l’inscription reste valide même si l’envoi échoue (journalisation uniquement).
- **Docker backend** : variante par rapport au squelette « mvnw dans l’image » : utilisation de Maven conteneurisé faute de `maven-wrapper.jar` versionné.

## Tests

```bash
./mvnw test
```

Inclut des tests unitaires sur la logique d’inscription (succès, capacité, email dupliqué).
