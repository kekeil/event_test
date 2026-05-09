# Gestion d’évènements (test technique)

Monorepo minimal : API **Spring Boot** (évènements, inscriptions, auth JWT, erreurs RFC 7807) et frontend **Next.js 16** (catalogue public, inscriptions, administration).

## Stack

| Couche | Technologies |
|--------|----------------|
| Backend | Java, Spring Boot 3, Spring Security + JWT, H2, SpringDoc OpenAPI |
| Frontend | Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind 4, axios, react-hook-form, zod, sonner |

## Démarrage rapide (Docker)

À la racine du dépôt :

```bash
docker compose up --build
```

- **Interface web** : [http://localhost:3000](http://localhost:3000)
- **API REST** : [http://localhost:8080](http://localhost:8080)
- **Swagger UI** : [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Identifiants administrateur (données de test)

- **Email** : `admin@event.local`
- **Mot de passe** : `Admin123!`

(Paramétrables via `ADMIN_EMAIL` / `ADMIN_PASSWORD` dans `docker-compose` ou le backend.)

## Documentation détaillée

- [README du backend](backend/README.md) — si présent dans le dépôt ; sinon se référer au `HELP.md` ou au code source.
- [README du frontend](web/README.md) — installation, variables, Docker, structure.

## Grille du sujet — transparence

| Exigence | Statut |
|----------|--------|
| Liste publique paginée + recherche + filtre date | Fait (`/events`) |
| Détail évènement + inscription + gestion erreurs (complet, doublon, validation) | Fait (`/events/[id]`) |
| Auth admin JWT + zone protégée sans `middleware.ts` | Fait (layout serveur `/admin`, routes `app/api/auth`) |
| CRUD admin évènements (liste, création, édition, suppression) | Fait |
| Liste / annulation des inscriptions côté admin | Fait |
| Docker (backend + web standalone) | Fait (`docker-compose.yml`) |
| Pas de `console.log` en livrable | Vérifié |
| UI exclusivement via composants shadcn (`npx shadcn add`) | Fait (dont `field` à la place de l’ancien `form` généré par le CLI v4) |

## Hypothèses

- Pagination API : le backend utilise une page **0-based** ; l’URL publique utilise `?page=` en **1-based** et la couche frontend convertit.
- Les dates évènement sont échangées en ISO 8601 ; le champ `datetime-local` est interprété en heure locale du navigateur puis converti en ISO pour l’API.
