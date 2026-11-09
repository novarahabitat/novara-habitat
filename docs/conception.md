# Outil de conception — notes de suivi

Notes tenues par Claude pour garder le contexte d'une session à l'autre.
Laurent n'est pas développeur : il dit ce qu'il veut, les décisions techniques
se prennent ici. Quand du matériel est nécessaire, proposer la solution la
moins chère qui fonctionne.

## Ce qu'est l'outil

`app/espace/conception/novara-plan.html` : **un seul fichier**, autonome, sans
framework ni étape de construction. Plan 2D, vue 3D (three.js chargé depuis
cdnjs), plusieurs chantiers, niveaux (cave, étages, combles, extérieur),
réseaux (électricité, domotique, eau, VMC, chauffage, jardin), tableau
électrique NF C 15-100 mono/tri, pack client.

Règles à ne pas perdre de vue :

- **Il reste un seul fichier.** Pas de découpage en modules, pas de framework,
  pas de build.
- **Après chaque modification, vérifier qu'il se charge sans erreur avant de
  publier** (voir « Comment tester » plus bas).
- Il doit continuer à fonctionner ouvert seul, sans réseau et sans compte.

## Comment c'est rangé

| Quoi | Où |
| --- | --- |
| Un chantier entier | objet `PROJ` : `levels[]`, `PROJ.elec`, `PROJ.pack` |
| Chantier dans le navigateur | `localStorage` sous `novara-proj:<id>`, index `novara-projects` |
| Photos du pack | IndexedDB base `novara-plan`, magasin `kv`, clé `pack:<id>` |
| Réglages | `localStorage` sous `novara-settings` |
| Chantier en ligne | table `plans` (Supabase), un plan par chantier |
| Photos en ligne | bucket privé `plans`, sous `<chantier_id>/<id de la photo>` |
| État de synchronisation | `localStorage` sous `novara-sync:<chantier_id>` |

L'outil est servi par `/espace/conception/outil` (jamais depuis `public/` : il
ne sort que pour le compte de l'espace pro). Il s'ouvre avec
`?chantier=<id>&nom=…&client=…` depuis `/espace/conception/plan`.

## Comment marche l'enregistrement en ligne

Le navigateur reste la source immédiate : on travaille sans réseau. Si le
chantier vient de l'Espace pro, il part aussi sur le site, 1,2 s après la
dernière modification, et repart tout seul au retour de la connexion.

L'appareil envoie la version qu'il avait sous les yeux (`base_version`). Si la
ligne a bougé entre-temps, **la date de modification la plus récente l'emporte**,
dans un sens comme dans l'autre, et un bandeau jaune explique ce qui s'est passé.
Les photos sont montées dans le stockage puis redescendues sur l'autre appareil ;
le document ne garde que leur chemin.

Routes : `/api/plans/[chantier]` (GET, PUT) et
`/api/plans/[chantier]/medias/[media]` (GET, PUT).

## Comment tester

L'outil est hors de `public/` et derrière l'authentification, donc pour le
charger en développement :

```bash
npm run dev
```

puis copier le fichier en `public/__verif-conception.html`, ouvrir
`http://localhost:3000/__verif-conception.html` (et avec
`?chantier=<un uuid>` pour voir la bascule hors ligne), lire la console, et
**supprimer la copie avant de committer**.

Vérifier aussi `npm run test:db`, `npx tsc --noEmit`, `npm run lint` et
`npm run build`.

## Liste d'attente, dans l'ordre

### 1. Import d'un plan existant (photo, scan ou PDF)

Caler un calque à l'échelle sous le plan, analyser automatiquement ce qu'on peut
(murs, pièces), et comparer les surfaces obtenues avec celles de l'ancien plan.

À creuser : mise à l'échelle par deux points de référence saisis à la main
(simple et fiable) avant toute détection automatique ; PDF lu avec pdf.js, photo
redressée par les quatre coins. Garder le tout dans le fichier unique.

### 2. Mode relevé laser

Sélectionner un mur, mesurer, la mesure arrive et l'outil passe au mur suivant.

- **Saisie au clavier pour tous les lasers** : à faire en premier, ça marche avec
  n'importe quel appareil et ça ne coûte rien.
- **Réception automatique d'un Leica DISTO D1** par Bluetooth, via le navigateur
  **Bluefy** sur iPad (Safari ne donne pas accès au Bluetooth).
  **À tester avant de promettre quoi que ce soit** : vérifier que le D1 expose
  bien ses mesures en Bluetooth LE et que Bluefy les reçoit.

### 3. Plus tard

Visite du chantier en vidéo, ou scan LiDAR.

## À faire dès que possible

- Appliquer `supabase/migrations/20261108000001_plans_conception.sql` à la base
  de production (table `plans` + bucket `plans`). Tant qu'elle n'est pas passée,
  l'outil fonctionne mais n'enregistre que dans le navigateur.
- `supabase/migrations/20260928000001_plans_techniques.sql`, non suivi par git,
  décrit un éditeur relationnel différent : **à ignorer**.
