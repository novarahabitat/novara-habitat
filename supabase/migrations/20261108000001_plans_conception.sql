-- Plans de l'outil de conception.
--
-- L'outil (app/espace/conception/novara-plan.html) est un fichier autonome qui
-- travaille dans le navigateur. Il garde sa copie locale ; cette table est la
-- copie en ligne, pour retrouver le même plan d'un appareil à l'autre.
--
-- Le dessin est enregistré tel que l'outil le produit (jsonb) : murs, pièces,
-- meubles, réseaux, tableau électrique, textes du pack client. La base ne
-- cherche pas à comprendre cette forme — l'outil en reste maître — elle ne
-- vérifie que ce dont l'Espace pro a besoin : à qui appartient le plan, de quel
-- chantier il parle, et quand il a été modifié.
--
-- Les photos du pack ne sont pas dans le document : elles vont dans le bucket
-- privé `plans`, et le document ne garde que leur chemin.
--
-- Tout le fichier s'exécute en une seule transaction.

begin;

-- 0. Refuser de s'exécuter si la table existe déjà.
do $$
begin
  if exists (select 1 from information_schema.tables
             where table_schema = 'public' and table_name = 'plans') then
    raise exception 'Table déjà existante, migration annulée : plans';
  end if;
end $$;

-- 1. Plan ---------------------------------------------------------------------

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  -- Un plan par chantier : l'outil s'ouvre depuis la fiche du chantier.
  chantier_id uuid not null unique references public.chantiers(id) on delete cascade,
  -- Le document de l'outil, dans sa propre forme.
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  -- Quelques chiffres recopiés du document (surface, nombre de pièces, mètres
  -- de murs) pour les afficher dans l'Espace pro sans relire tout le document.
  resume jsonb not null default '{}'::jsonb check (jsonb_typeof(resume) = 'object'),
  -- Augmente à chaque enregistrement : sert à repérer qu'un autre appareil est
  -- passé entre le moment où cet appareil a lu le plan et celui où il le réécrit.
  version integer not null default 1 check (version > 0),
  -- Heure de la modification telle que l'appareil la connaît. C'est elle qui
  -- départage deux appareils : la plus récente gagne.
  modifie_le timestamptz not null default now(),
  -- « iPad de Laurent », « Mac » : affiché dans l'avertissement de conflit.
  appareil text check (appareil is null or length(appareil) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index plans_owner_idx on public.plans (owner_id, updated_at desc);

create trigger plans_updated_at before update on public.plans
  for each row execute function public.maj_updated_at();

-- 2. Sécurité ligne par ligne --------------------------------------------------

alter table public.plans enable row level security;

create policy "admin" on public.plans for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));

-- 3. Photos du pack client : bucket privé --------------------------------------
-- Rangées sous `<chantier_id>/<id de la photo>`. Bucket distinct de `chantiers`
-- pour ne pas mélanger ces images avec les photos avant/pendant/après.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plans', 'plans', false, 10485760, array['image/jpeg', 'image/png', 'image/webp']);

create policy "plans admin lecture" on storage.objects for select to authenticated
  using (bucket_id = 'plans' and (select public.est_admin()));
create policy "plans admin ajout" on storage.objects for insert to authenticated
  with check (bucket_id = 'plans' and (select public.est_admin()));
create policy "plans admin remplacement" on storage.objects for update to authenticated
  using (bucket_id = 'plans' and (select public.est_admin()))
  with check (bucket_id = 'plans' and (select public.est_admin()));
create policy "plans admin suppression" on storage.objects for delete to authenticated
  using (bucket_id = 'plans' and (select public.est_admin()));

commit;
