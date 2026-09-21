-- NOVARA Habitat v2 — espace privé (chantiers, photos, factures, pack de fin de chantier)
--
-- Tout le fichier s'exécute en une seule transaction : si une étape échoue,
-- rien n'est créé. Les anciennes tables (brain_*, employees, etc.) ne sont
-- pas touchées.

begin;

-- 0. Refuser de s'exécuter si une table du même nom existe déjà.
do $$
declare
  existantes text;
begin
  select string_agg(table_name, ', ') into existantes
  from information_schema.tables
  where table_schema = 'public'
    and table_name in (
      'app_admin', 'entreprise', 'clients', 'chantiers', 'chantier_commentaires',
      'chantier_photos', 'factures', 'facture_lignes', 'compteurs_factures',
      'demandes_contact'
    );
  if existantes is not null then
    raise exception 'Tables déjà existantes, migration annulée : %', existantes;
  end if;
end $$;

-- 1. Administrateur unique ----------------------------------------------------
-- Seul un compte présent dans app_admin peut lire ou écrire les données.
-- Les autres comptes Supabase existants ne voient rien.

create table public.app_admin (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.app_admin enable row level security;

create policy "admin lit sa ligne" on public.app_admin
  for select to authenticated using (user_id = (select auth.uid()));

create function public.est_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admin where user_id = auth.uid());
$$;

revoke all on function public.est_admin() from public;
grant execute on function public.est_admin() to anon, authenticated;

create function public.maj_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- 2. Entreprise (mentions légales des factures) ------------------------------

create table public.entreprise (
  owner_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  raison_sociale text not null default '',
  forme_juridique text,
  capital text,
  adresse text,
  code_postal text,
  ville text,
  telephone text,
  email text,
  site_web text,
  siret text,
  rcs text,
  tva_intracom text,
  franchise_tva boolean not null default false,
  assureur_decennale text,
  police_decennale text,
  zone_couverture text,
  iban text,
  bic text,
  delai_paiement_jours integer not null default 30 check (delai_paiement_jours between 0 and 60),
  conditions_paiement text not null default 'Paiement par virement à réception de facture. Pas d''escompte pour paiement anticipé.',
  penalites_retard text not null default 'Pénalités de retard : trois fois le taux d''intérêt légal. Pour les clients professionnels, indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce).',
  prefixe_facture text not null default 'F' check (prefixe_facture ~ '^[A-Z0-9]{1,6}$'),
  mentions_libres text,
  updated_at timestamptz not null default now()
);

create trigger entreprise_updated_at before update on public.entreprise
  for each row execute function public.maj_updated_at();

-- 3. Clients -------------------------------------------------------------------

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null default 'particulier' check (type in ('particulier', 'professionnel')),
  nom text not null check (length(trim(nom)) > 0),
  societe text,
  siret text,
  tva_intracom text,
  email text,
  telephone text,
  adresse text,
  code_postal text,
  ville text,
  notes text,
  created_at timestamptz not null default now()
);

create index clients_owner_idx on public.clients (owner_id, nom);

-- 4. Chantiers -----------------------------------------------------------------

create table public.chantiers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete restrict,
  titre text not null check (length(trim(titre)) > 0),
  adresse text,
  code_postal text,
  ville text,
  statut text not null default 'prevu' check (statut in ('prevu', 'en_cours', 'termine', 'annule')),
  date_debut date,
  date_fin date,
  description text,
  recap_travaux text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chantiers_owner_idx on public.chantiers (owner_id, statut);
create index chantiers_client_idx on public.chantiers (client_id);

create trigger chantiers_updated_at before update on public.chantiers
  for each row execute function public.maj_updated_at();

create table public.chantier_commentaires (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  chantier_id uuid not null references public.chantiers(id) on delete cascade,
  contenu text not null check (length(trim(contenu)) > 0),
  created_at timestamptz not null default now()
);

create index chantier_commentaires_idx on public.chantier_commentaires (chantier_id, created_at desc);

create table public.chantier_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  chantier_id uuid not null references public.chantiers(id) on delete cascade,
  storage_path text not null unique,
  phase text not null default 'pendant' check (phase in ('avant', 'pendant', 'apres')),
  legende text,
  dans_pack boolean not null default false,
  created_at timestamptz not null default now()
);

create index chantier_photos_idx on public.chantier_photos (chantier_id, phase, created_at);

-- 5. Factures ------------------------------------------------------------------
-- Règles tenues par la base, pas par l'interface :
--   * numéro attribué uniquement à l'émission, séquence continue par année ;
--   * une facture émise ne peut plus être modifiée ni supprimée (on fait un avoir) ;
--   * les coordonnées de l'entreprise et du client sont figées à l'émission.

create table public.factures (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null default 'facture' check (type in ('facture', 'avoir')),
  facture_origine_id uuid references public.factures(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,
  chantier_id uuid references public.chantiers(id) on delete set null,
  statut text not null default 'brouillon' check (statut in ('brouillon', 'emise', 'payee')),
  numero text,
  date_emission date,
  date_echeance date,
  date_paiement date,
  mode_paiement text,
  objet text,
  periode_travaux text,
  mention_tva text,
  notes_internes text,
  total_ht numeric(12, 2) not null default 0,
  total_tva numeric(12, 2) not null default 0,
  total_ttc numeric(12, 2) not null default 0,
  emetteur jsonb,
  destinataire jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, numero),
  check ((statut = 'brouillon') = (numero is null)),
  check (type = 'facture' or facture_origine_id is not null)
);

create index factures_owner_idx on public.factures (owner_id, statut, date_emission desc);
create index factures_chantier_idx on public.factures (chantier_id);

create trigger factures_updated_at before update on public.factures
  for each row execute function public.maj_updated_at();

create table public.facture_lignes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  facture_id uuid not null references public.factures(id) on delete cascade,
  position integer not null default 0,
  designation text not null check (length(trim(designation)) > 0),
  quantite numeric(12, 3) not null default 1,
  unite text,
  prix_unitaire_ht numeric(12, 2) not null default 0,
  taux_tva numeric(4, 2) not null default 20 check (taux_tva in (0, 5.5, 10, 20)),
  created_at timestamptz not null default now()
);

create index facture_lignes_idx on public.facture_lignes (facture_id, position);

create table public.compteurs_factures (
  owner_id uuid not null references auth.users(id) on delete cascade,
  annee integer not null,
  dernier integer not null default 0 check (dernier >= 0),
  primary key (owner_id, annee)
);

-- Totaux : recalculés par la base à chaque changement de ligne.
-- HT arrondi par ligne, TVA calculée par taux sur le total HT du taux.
create function public.recalculer_totaux(p_facture_id uuid) returns void
language plpgsql set search_path = public as $$
declare
  v_ht numeric(12, 2);
  v_tva numeric(12, 2);
begin
  with lignes as (
    select taux_tva, round(quantite * prix_unitaire_ht, 2) as ht
    from facture_lignes where facture_id = p_facture_id
  ), par_taux as (
    select taux_tva, sum(ht) as ht from lignes group by taux_tva
  )
  select coalesce(sum(ht), 0), coalesce(sum(round(ht * taux_tva / 100, 2)), 0)
  into v_ht, v_tva from par_taux;

  update factures
  set total_ht = v_ht, total_tva = v_tva, total_ttc = v_ht + v_tva
  where id = p_facture_id and statut = 'brouillon';
end $$;

create function public.proteger_lignes() returns trigger
language plpgsql set search_path = public as $$
declare
  v_facture uuid := coalesce(new.facture_id, old.facture_id);
begin
  if exists (select 1 from factures where id = v_facture and statut <> 'brouillon') then
    raise exception 'Une facture émise ne peut plus être modifiée. Faites un avoir.';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;

create trigger facture_lignes_protection before insert or update or delete on public.facture_lignes
  for each row execute function public.proteger_lignes();

create function public.lignes_totaux() returns trigger
language plpgsql set search_path = public as $$
begin
  perform recalculer_totaux(coalesce(new.facture_id, old.facture_id));
  return null;
end $$;

create trigger facture_lignes_totaux after insert or update or delete on public.facture_lignes
  for each row execute function public.lignes_totaux();

create function public.proteger_facture() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    if old.statut <> 'brouillon' then
      raise exception 'Une facture émise ne peut pas être supprimée. Faites un avoir.';
    end if;
    return old;
  end if;

  if old.statut = 'brouillon' then
    if new.statut = 'payee' then
      raise exception 'Une facture doit être émise avant d''être marquée payée.';
    end if;
    if new.statut = 'emise' and current_setting('novara.emission', true) is distinct from 'on' then
      raise exception 'Utilisez l''action « Émettre » pour émettre une facture.';
    end if;
    return new;
  end if;

  -- Facture émise : seuls le paiement et les notes internes peuvent changer.
  if new.statut = 'brouillon' then
    raise exception 'Une facture émise ne peut pas redevenir brouillon.';
  end if;
  if (new.type, new.facture_origine_id, new.client_id, new.numero, new.date_emission,
      new.date_echeance, new.objet, new.periode_travaux, new.mention_tva,
      new.total_ht, new.total_tva, new.total_ttc, new.emetteur, new.destinataire, new.owner_id)
     is distinct from
     (old.type, old.facture_origine_id, old.client_id, old.numero, old.date_emission,
      old.date_echeance, old.objet, old.periode_travaux, old.mention_tva,
      old.total_ht, old.total_tva, old.total_ttc, old.emetteur, old.destinataire, old.owner_id) then
    raise exception 'Une facture émise ne peut plus être modifiée. Faites un avoir.';
  end if;
  return new;
end $$;

create trigger factures_protection before update or delete on public.factures
  for each row execute function public.proteger_facture();

-- Émission : attribue le numéro suivant et fige les coordonnées.
create function public.emettre_facture(p_facture_id uuid) returns public.factures
language plpgsql security invoker set search_path = public as $$
declare
  f factures;
  e entreprise;
  c clients;
  v_annee integer;
  v_num integer;
  v_jour date := (now() at time zone 'Europe/Paris')::date;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;

  select * into f from factures where id = p_facture_id for update;
  if not found then
    raise exception 'Facture introuvable.';
  end if;
  if f.statut <> 'brouillon' then
    raise exception 'Cette facture est déjà émise (%).', f.numero;
  end if;
  if not exists (select 1 from facture_lignes where facture_id = f.id) then
    raise exception 'La facture ne contient aucune ligne.';
  end if;

  select * into e from entreprise where owner_id = f.owner_id;
  if not found or coalesce(trim(e.raison_sociale), '') = '' or coalesce(trim(e.siret), '') = ''
     or coalesce(trim(e.adresse), '') = '' or coalesce(trim(e.ville), '') = '' then
    raise exception 'Complétez d''abord votre entreprise dans Paramètres (raison sociale, adresse, ville, SIRET).';
  end if;
  if not e.franchise_tva and coalesce(trim(e.tva_intracom), '') = '' then
    raise exception 'Renseignez votre numéro de TVA intracommunautaire dans Paramètres.';
  end if;
  if e.franchise_tva
     and exists (select 1 from facture_lignes where facture_id = f.id and taux_tva <> 0) then
    raise exception 'Vous êtes en franchise de TVA : toutes les lignes doivent être à 0 %%.';
  end if;
  if coalesce(trim(e.assureur_decennale), '') = '' or coalesce(trim(e.police_decennale), '') = '' then
    raise exception 'Renseignez votre assurance décennale dans Paramètres (mention obligatoire pour les travaux).';
  end if;
  if not e.franchise_tva
     and exists (select 1 from facture_lignes where facture_id = f.id and taux_tva = 0)
     and coalesce(trim(f.mention_tva), '') = '' then
    raise exception 'Une ligne à 0 %% de TVA demande une mention (autoliquidation, exonération…).';
  end if;
  if exists (select 1 from facture_lignes where facture_id = f.id and taux_tva in (5.5, 10))
     and coalesce(trim(f.mention_tva), '') = '' then
    raise exception 'TVA à taux réduit : ajoutez la mention de l''attestation remise par le client.';
  end if;

  select * into c from clients where id = f.client_id;

  v_annee := extract(year from v_jour)::integer;
  insert into compteurs_factures (owner_id, annee, dernier)
  values (f.owner_id, v_annee, 1)
  on conflict (owner_id, annee) do update set dernier = compteurs_factures.dernier + 1
  returning dernier into v_num;

  perform set_config('novara.emission', 'on', true);

  update factures set
    statut = 'emise',
    numero = e.prefixe_facture || '-' || v_annee || '-' || lpad(v_num::text, 4, '0'),
    date_emission = v_jour,
    date_echeance = coalesce(f.date_echeance, v_jour + e.delai_paiement_jours),
    emetteur = to_jsonb(e) - 'owner_id' - 'updated_at',
    destinataire = to_jsonb(c) - 'owner_id' - 'notes' - 'created_at' - 'id'
  where id = f.id
  returning * into f;

  perform set_config('novara.emission', 'off', true);
  return f;
end $$;

-- Avoir : brouillon qui reprend les lignes de la facture avec des montants négatifs.
create function public.creer_avoir(p_facture_id uuid) returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  f factures;
  v_avoir uuid;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  select * into f from factures where id = p_facture_id;
  if not found or f.statut = 'brouillon' or f.type <> 'facture' then
    raise exception 'Un avoir se fait sur une facture émise.';
  end if;

  insert into factures (owner_id, type, facture_origine_id, client_id, chantier_id, objet, periode_travaux, mention_tva)
  values (f.owner_id, 'avoir', f.id, f.client_id, f.chantier_id,
          'Avoir sur la facture ' || f.numero, f.periode_travaux, f.mention_tva)
  returning id into v_avoir;

  insert into facture_lignes (owner_id, facture_id, position, designation, quantite, unite, prix_unitaire_ht, taux_tva)
  select owner_id, v_avoir, position, designation, quantite, unite, -prix_unitaire_ht, taux_tva
  from facture_lignes where facture_id = f.id;

  return v_avoir;
end $$;

-- Reprise de la numérotation existante : fixer le dernier numéro déjà émis
-- ailleurs pour une année, tant qu'aucune facture n'a été émise ici cette année-là.
create function public.fixer_dernier_numero(p_annee integer, p_dernier integer) returns void
language plpgsql security invoker set search_path = public as $$
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  if p_dernier < 0 then
    raise exception 'Le numéro doit être positif.';
  end if;
  if exists (
    select 1 from factures
    where owner_id = auth.uid() and statut <> 'brouillon'
      and extract(year from date_emission) = p_annee
  ) then
    raise exception 'Des factures ont déjà été émises en % : la numérotation ne peut plus être changée.', p_annee;
  end if;
  insert into compteurs_factures (owner_id, annee, dernier)
  values (auth.uid(), p_annee, p_dernier)
  on conflict (owner_id, annee) do update set dernier = excluded.dernier;
end $$;

revoke all on function public.emettre_facture(uuid) from public, anon;
revoke all on function public.creer_avoir(uuid) from public, anon;
revoke all on function public.fixer_dernier_numero(integer, integer) from public, anon;
revoke all on function public.recalculer_totaux(uuid) from public, anon;
grant execute on function public.recalculer_totaux(uuid) to authenticated;
grant execute on function public.emettre_facture(uuid) to authenticated;
grant execute on function public.creer_avoir(uuid) to authenticated;
grant execute on function public.fixer_dernier_numero(integer, integer) to authenticated;

-- 6. Demandes de contact (formulaire du site public) --------------------------

create table public.demandes_contact (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (length(trim(nom)) between 1 and 200),
  telephone text check (length(telephone) <= 40),
  email text check (length(email) <= 200),
  type_projet text check (length(type_projet) <= 200),
  message text check (length(message) <= 5000),
  traitee boolean not null default false,
  created_at timestamptz not null default now(),
  check (coalesce(telephone, '') <> '' or coalesce(email, '') <> '')
);

create index demandes_contact_idx on public.demandes_contact (traitee, created_at desc);

-- 7. Sécurité ligne par ligne --------------------------------------------------

alter table public.entreprise enable row level security;
alter table public.clients enable row level security;
alter table public.chantiers enable row level security;
alter table public.chantier_commentaires enable row level security;
alter table public.chantier_photos enable row level security;
alter table public.factures enable row level security;
alter table public.facture_lignes enable row level security;
alter table public.compteurs_factures enable row level security;
alter table public.demandes_contact enable row level security;

create policy "admin" on public.entreprise for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.clients for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.chantiers for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.chantier_commentaires for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.chantier_photos for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.factures for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.facture_lignes for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin lecture" on public.compteurs_factures for select to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()));
-- Écriture des compteurs : uniquement via emettre_facture / fixer_dernier_numero.
create policy "admin ecriture" on public.compteurs_factures for insert to authenticated
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin maj" on public.compteurs_factures for update to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()));

-- Le site public peut déposer une demande, jamais la relire.
create policy "public depose" on public.demandes_contact for insert to anon, authenticated
  with check (traitee = false);
create policy "admin lit" on public.demandes_contact for select to authenticated
  using ((select public.est_admin()));
create policy "admin traite" on public.demandes_contact for update to authenticated
  using ((select public.est_admin())) with check ((select public.est_admin()));
create policy "admin supprime" on public.demandes_contact for delete to authenticated
  using ((select public.est_admin()));

-- 8. Photos : bucket privé ----------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chantiers', 'chantiers', false, 15728640, array['image/jpeg', 'image/png', 'image/webp']);

create policy "chantiers admin lecture" on storage.objects for select to authenticated
  using (bucket_id = 'chantiers' and (select public.est_admin()));
create policy "chantiers admin ajout" on storage.objects for insert to authenticated
  with check (bucket_id = 'chantiers' and (select public.est_admin()));
create policy "chantiers admin suppression" on storage.objects for delete to authenticated
  using (bucket_id = 'chantiers' and (select public.est_admin()));

commit;
