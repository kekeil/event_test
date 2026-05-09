# Event web (frontend)

Application Next.js pour le test technique : catalogue public d’évènements, inscriptions, et espace administrateur (JWT).

## Stack

- **Next.js 16** (App Router, build Turbopack en dev), **React 19**, **TypeScript**
- **Tailwind CSS 4**, **shadcn/ui** (preset `radix-nova`, base `neutral`)
- **axios** (client HTTP + interceptors), **react-hook-form** + **zod** + **@hookform/resolvers**
- **sonner** (toasts), **next-themes** (clair / sombre)

Les formulaires utilisent les composants **Field** générés par shadcn (v4 du CLI, à la place de l’ancien composant `form`).

## Prérequis

- **Node.js 20** ou supérieur
- Backend Spring Boot joignable (voir variables d’environnement)

## Installation

```bash
npm install
```

## Variables d’environnement

Copiez `web/.env.example` vers `web/.env.local` et adaptez si besoin :

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_API_BASE_URL` | URL du backend pour le navigateur (axios). Défaut : `http://localhost:8080`. |
| `BACKEND_INTERNAL_URL` | URL du backend pour le **serveur** Next (Server Components et route handlers `app/api/auth/*`). En local : souvent identique à la précédente. **Dans Docker Compose** : `http://backend:8080`. |

## Lancement en développement

```bash
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000) (redirection vers `/events`).

## Build de production

```bash
npm run build
npm start
```

## Qualité (avant commit)

```bash
npm run typecheck
npm run lint
npm run build
```

## Identifiants admin de test

Alignés sur le backend (valeurs par défaut dans `application.properties` / `docker-compose`) :

- **Email** : `admin@event.local`
- **Mot de passe** : `Admin123!`

## Structure (résumé)

- `app/` — routes App Router (`/events`, `/events/[id]`, `/login`, `/admin/...`, `api/auth/...`)
- `components/` — UI métier (header, formulaires, tableaux admin) et `components/ui/` (shadcn)
- `lib/api/` — client axios, helpers fetch serveur, modules par domaine
- `lib/auth/` — lecture cookie serveur, décodage JWT (payload uniquement, sans vérification cryptographique)
- `lib/schemas/` — schémas Zod partagés avec les formulaires
- `hooks/` — utilitaires React (`useDebounce`, etc.)

## Choix de conception et compromis

- **Cookie `auth_token` non-httpOnly** : posé par la route handler Next après login, pour que le client puisse lire le jeton et l’envoyer en en-tête `Authorization` vers l’API Spring (origine différente, pas d’envoi automatique du cookie vers `8080`). En production on privilégierait en général un cookie httpOnly + proxy BFF ou session serveur.
- **Pas de `middleware.ts` Next** : protection de `/admin/*` via `app/admin/layout.tsx` (Server Component) qui lit le cookie et redirige vers `/login`.
- **Formulaires** : shadcn `Field` + `Controller` (react-hook-form), cohérent avec le preset v4 où le composant `form` historique n’est pas ajouté par le CLI.

## Docker

Image **standalone** Next.js (voir `next.config.mjs` avec `output: "standalone"`).

```bash
docker compose up --build
```

Le service `web` utilise `BACKEND_INTERNAL_URL=http://backend:8080` pour joindre l’API depuis le conteneur ; le navigateur continue d’appeler l’API sur `NEXT_PUBLIC_API_BASE_URL` (par défaut `http://localhost:8080` depuis la machine hôte si les ports sont exposés).
