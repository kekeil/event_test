# Event Management — Test technique

Application de gestion d'évènements avec inscriptions en ligne et contrôle de capacité.

- **Backend** : Spring Boot 4.0.6 / Java 21 — API REST, H2 in-memory, JWT, RFC 7807, Swagger
- **Frontend** : Next.js 16 / React 19 / TypeScript — shadcn/ui, Tailwind 4, axios

## Démarrage en une commande (Docker)

Prérequis : **Docker** + **Docker Compose v2** (intégré à Docker Desktop ou paquet `docker-compose-plugin`).

À la racine du repo :

```bash
docker compose up --build
```

Au premier lancement, comptez environ **2 à 4 minutes** (build Maven + build Next.js).

Une fois les deux conteneurs démarrés :

| Service       | URL                                          |
|---------------|----------------------------------------------|
| Frontend      | http://localhost:3000                        |
| API           | http://localhost:8080                        |
| Swagger UI    | http://localhost:8080/swagger-ui.html        |
| Console H2    | http://localhost:8080/h2-console             |

### Compte admin par défaut

- Email : `admin@event.local`
- Mot de passe : `Admin123!`

> Les valeurs ci-dessus sont seedées au démarrage si la table `users` est vide. À changer en prod via les variables d'environnement (voir plus bas).

### Arrêter

```bash
docker compose down
```

### Reconstruire après une modif de code

```bash
docker compose up --build
```

### Voir les logs

```bash
docker compose logs -f backend   # ou web
```

---

## Personnaliser la configuration

Crée un fichier `.env` à la racine (à côté de `docker-compose.yml`) pour surcharger les valeurs par défaut sans toucher au compose :

```env
# === Backend ===
JWT_SECRET=remplacer-par-une-cle-base64-d-au-moins-32-octets
ADMIN_EMAIL=admin@event.local
ADMIN_PASSWORD=Admin123!
CORS_ALLOWED_ORIGINS=http://localhost:3000

# === Mail (optionnel, désactivé par défaut) ===
MAIL_ENABLED=false
MAIL_FROM=no-reply@event.local
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=

# === Frontend ===
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
BACKEND_INTERNAL_URL=http://backend:8080
```

Puis relancer :

```bash
docker compose up --build
```

> 💡 **Générer un `JWT_SECRET`** valide (32 octets en Base64) :
> ```bash
> openssl rand -base64 32
> ```

---

## Activer l'envoi de mails de confirmation

Par défaut le backend log les inscriptions sans envoyer de mail (pour ne pas exiger de credentials SMTP). Pour activer l'envoi réel via Gmail :

1. Génère un **mot de passe d'application** Gmail (compte Google → Sécurité → Validation en 2 étapes → Mots de passe d'application).
2. Renseigne dans `.env` :
   ```env
   MAIL_ENABLED=true
   MAIL_USERNAME=ton.email@gmail.com
   MAIL_PASSWORD=xxxxxxxxxxxxxxxx        # le mot de passe d'application, pas ton mdp Gmail
   MAIL_FROM=ton.email@gmail.com
   ```
3. `docker compose up --build`

L'inscription reste valide **même si l'envoi du mail échoue** (logué côté serveur, pas d'erreur côté client).

---

## Lancement sans Docker (dev)

### Backend

```bash
cd backend
./mvnw spring-boot:run
# Windows : .\mvnw.cmd spring-boot:run
```

### Frontend

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

---


## Fonctionnalités couvertes (vs. cahier des charges)

### Backend (API REST sous `/api`)

- ✅ CRUD évènements (`/events`, `/events/{id}`)
- ✅ Inscriptions (`/events/{id}/register`, `/events/{id}/registrations`, `/registrations/{id}`)
- ✅ Recherche `?search=` + filtre `?date=` + pagination `?page=&limit=`
- ✅ Codes HTTP : 200, 201, 400, 401, 403, 404, 409 (DUPLICATE_EMAIL), 422 (CAPACITY_REACHED)
- ✅ RFC 7807 (`application/problem+json`) sur toutes les erreurs
- ✅ Auth JWT, seeder admin par défaut
- ✅ Swagger UI distinguant routes publiques / admin
- ✅ Tests unitaires sur capacité et email dupliqué

### Frontend

- ✅ **Écran 1** — Liste publique des évènements (cartes, recherche, badge Complet, navigation détail)
- ✅ **Écran 2** — Détail + formulaire d'inscription (compteur de places, désactivation si complet, toasts)
- ✅ **Écran 3 (optionnel)** — Création d'évènement (espace admin, validation client)
- ✅ Espace admin : édition, suppression, gestion des inscriptions
- ✅ Responsive ≥ 375px, mode clair/sombre
- ✅ Aucun `console.log` côté client, erreurs visibles à l'écran (toasts top-right, 1 s)

---

## Documentation détaillée

- [`backend/README.md`](./backend/README.md) — détails API, exemples cURL, tests
- [`web/README.md`](./web/README.md) — détails frontend, structure, choix techniques
- Swagger : http://localhost:8080/swagger-ui.html (une fois le backend lancé)