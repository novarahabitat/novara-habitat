# NOVARA Habitat v2

Site public de NOVARA Habitat et espace pro privé (un seul compte : le dirigeant).

- **Site public** : `/`, `/experience`, `/contact` (le formulaire enregistre les demandes).
- **Espace pro** (`/espace`, connexion sur `/connexion`) : chantiers, journal, photos
  avant/pendant/après, clients, factures et avoirs, demandes de contact, réglages.
- **PDF** : facture (`/api/factures/[id]/pdf`) et pack de fin de chantier remis au client
  (`/api/chantiers/[id]/pack`).

L'ancien système (Brain, Core, Sales, espace client…) est archivé sous l'étiquette git
`archive-v1`. `app/naomi` est un outil personnel indépendant, hors du périmètre du site.

## Base de données (Supabase)

La structure est dans `supabase/migrations/`. Les règles importantes sont tenues par la
base elle-même, pas par l'interface :

- seul le compte inscrit dans `app_admin` lit ou écrit les données (RLS) ;
- une facture reçoit son numéro à l'émission (`emettre_facture`), séquence continue par
  année ; une facture émise ne peut plus être modifiée ni supprimée : on fait un avoir ;
- les photos sont dans un bucket privé `chantiers`.

Vérifier la migration localement (Postgres embarqué, aucune connexion à la production) :

```bash
npm run test:db
```

## Développement

Variables nécessaires (`.env.local`) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

```bash
npm run dev
```

`/api/keepalive` est appelée chaque jour par Vercel Cron pour éviter la mise en pause du
projet Supabase gratuit.
