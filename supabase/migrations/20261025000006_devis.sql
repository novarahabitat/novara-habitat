-- Devis.
--
-- Cycle de vie : brouillon -> envoyé (numéro attribué) -> accepté ou refusé.
-- Un devis se modifie tant qu'il n'est ni accepté ni refusé (on ajuste puis on
-- renvoie le PDF). Accepté, il est figé : on encaisse des acomptes dessus
-- (factures d'acompte rattachées au devis), puis on le transforme en facture.
-- La facture finale déduit à son émission les acomptes du devis.

begin;

-- 1. Réglages -------------------------------------------------------------------

alter table public.entreprise
  add column prefixe_devis text not null default 'D' check (prefixe_devis ~ '^[A-Z0-9]{1,6}$'),
  add column validite_devis_jours integer not null default 30 check (validite_devis_jours between 1 and 365);

-- 2. Devis -----------------------------------------------------------------------

create table public.devis (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  chantier_id uuid references public.chantiers(id) on delete set null,
  statut text not null default 'brouillon' check (statut in ('brouillon', 'envoye', 'accepte', 'refuse')),
  numero text,
  date_emission date,
  date_validite date,
  date_reponse date,
  objet text,
  periode_travaux text,
  lieu_travaux text,
  nature_operation text not null default 'prestation_services'
    check (nature_operation in ('prestation_services', 'livraison_biens', 'mixte')),
  mention_tva text,
  conditions text,
  notes_internes text,
  total_ht numeric(12, 2) not null default 0,
  total_tva numeric(12, 2) not null default 0,
  total_ttc numeric(12, 2) not null default 0,
  emetteur jsonb,
  destinataire jsonb,
  facture_id uuid references public.factures(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, numero),
  check ((statut = 'brouillon') = (numero is null))
);

create index devis_owner_idx on public.devis (owner_id, statut, created_at desc);
create index devis_chantier_idx on public.devis (chantier_id);
create index devis_client_idx on public.devis (client_id);

create trigger devis_updated_at before update on public.devis
  for each row execute function public.maj_updated_at();

create table public.devis_lignes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  devis_id uuid not null references public.devis(id) on delete cascade,
  position integer not null default 0,
  designation text not null check (length(trim(designation)) > 0),
  quantite numeric(12, 3) not null default 1,
  unite text,
  prix_unitaire_ht numeric(12, 2) not null default 0,
  taux_tva numeric(4, 2) not null default 20 check (taux_tva in (0, 5.5, 10, 20)),
  created_at timestamptz not null default now()
);

create index devis_lignes_idx on public.devis_lignes (devis_id, position);

create table public.compteurs_devis (
  owner_id uuid not null references auth.users(id) on delete cascade,
  annee integer not null,
  dernier integer not null default 0 check (dernier >= 0),
  primary key (owner_id, annee)
);

-- Les factures (acomptes, facture finale) se rattachent à leur devis.
alter table public.factures
  add column devis_id uuid references public.devis(id) on delete restrict;

create index factures_devis_idx on public.factures (devis_id);

-- 3. Totaux et protections ------------------------------------------------------

create function public.recalculer_totaux_devis(p_devis_id uuid) returns void
language plpgsql set search_path = public as $$
declare
  v_ht numeric(12, 2);
  v_tva numeric(12, 2);
begin
  with lignes as (
    select taux_tva, round(quantite * prix_unitaire_ht, 2) as ht
    from devis_lignes where devis_id = p_devis_id
  ), par_taux as (
    select taux_tva, sum(ht) as ht from lignes group by taux_tva
  )
  select coalesce(sum(ht), 0), coalesce(sum(round(ht * taux_tva / 100, 2)), 0)
  into v_ht, v_tva from par_taux;

  update devis
  set total_ht = v_ht, total_tva = v_tva, total_ttc = v_ht + v_tva
  where id = p_devis_id and statut in ('brouillon', 'envoye');
end $$;

create function public.proteger_lignes_devis() returns trigger
language plpgsql set search_path = public as $$
declare
  v_devis uuid := coalesce(new.devis_id, old.devis_id);
begin
  if exists (select 1 from devis where id = v_devis and statut in ('accepte', 'refuse')) then
    raise exception 'Ce devis est accepté ou refusé : il ne peut plus être modifié.';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $$;

create trigger devis_lignes_protection before insert or update or delete on public.devis_lignes
  for each row execute function public.proteger_lignes_devis();

create function public.lignes_devis_totaux() returns trigger
language plpgsql set search_path = public as $$
begin
  perform recalculer_totaux_devis(coalesce(new.devis_id, old.devis_id));
  return null;
end $$;

create trigger devis_lignes_totaux after insert or update or delete on public.devis_lignes
  for each row execute function public.lignes_devis_totaux();

create function public.proteger_devis() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    if old.statut = 'accepte' then
      raise exception 'Un devis accepté ne peut pas être supprimé.';
    end if;
    return old;
  end if;

  -- Le numéro n'est attribué que par « Envoyer » et ne change plus ensuite.
  if new.numero is distinct from old.numero
     and current_setting('novara.devis', true) is distinct from 'on' then
    raise exception 'Le numéro d''un devis ne se modifie pas.';
  end if;
  if old.statut = 'brouillon' and new.statut <> 'brouillon'
     and current_setting('novara.devis', true) is distinct from 'on' then
    raise exception 'Utilisez l''action « Envoyer » pour numéroter le devis.';
  end if;
  if old.statut <> 'brouillon' and new.statut = 'brouillon' then
    raise exception 'Un devis envoyé ne peut pas redevenir brouillon.';
  end if;

  -- Accepté ou refusé : figé. Seuls la réponse, les notes et le lien vers la
  -- facture bougent ; un devis peut être rouvert (retour à « envoyé ») tant
  -- qu'il n'a ni facture ni acompte.
  if old.statut in ('accepte', 'refuse') then
    if new.statut = 'envoye' then
      if old.facture_id is not null
         or exists (select 1 from factures where devis_id = old.id) then
        raise exception 'Ce devis a déjà des factures : il ne peut plus être rouvert.';
      end if;
    end if;
    if (new.client_id, new.chantier_id, new.numero, new.date_emission, new.date_validite, new.objet,
        new.periode_travaux, new.lieu_travaux, new.nature_operation, new.mention_tva, new.conditions,
        new.total_ht, new.total_tva, new.total_ttc, new.emetteur, new.destinataire, new.owner_id)
       is distinct from
       (old.client_id, old.chantier_id, old.numero, old.date_emission, old.date_validite, old.objet,
        old.periode_travaux, old.lieu_travaux, old.nature_operation, old.mention_tva, old.conditions,
        old.total_ht, old.total_tva, old.total_ttc, old.emetteur, old.destinataire, old.owner_id) then
      raise exception 'Ce devis est accepté ou refusé : il ne peut plus être modifié.';
    end if;
  end if;
  return new;
end $$;

create trigger devis_protection before update or delete on public.devis
  for each row execute function public.proteger_devis();

-- 4. Actions ------------------------------------------------------------------------

-- Envoyer : attribue le numéro (première fois), fige les coordonnées et la date.
-- Rappeler « Envoyer » sur un devis déjà envoyé et ajusté met à jour la date et
-- les coordonnées, sans changer le numéro.
create function public.envoyer_devis(p_devis_id uuid) returns public.devis
language plpgsql security invoker set search_path = public as $$
declare
  d devis;
  e entreprise;
  c clients;
  v_jour date := (now() at time zone 'Europe/Paris')::date;
  v_annee integer;
  v_num integer;
  v_numero text;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;

  select * into d from devis where id = p_devis_id for update;
  if not found then
    raise exception 'Devis introuvable.';
  end if;
  if d.statut not in ('brouillon', 'envoye') then
    raise exception 'Ce devis est déjà accepté ou refusé.';
  end if;
  if not exists (select 1 from devis_lignes where devis_id = d.id) then
    raise exception 'Le devis ne contient aucune ligne.';
  end if;

  select * into e from entreprise where owner_id = d.owner_id;
  if not found or coalesce(trim(e.raison_sociale), '') = '' or coalesce(trim(e.siret), '') = ''
     or coalesce(trim(e.adresse), '') = '' or coalesce(trim(e.ville), '') = '' then
    raise exception 'Complétez d''abord votre entreprise dans Paramètres (raison sociale, adresse, ville, SIRET).';
  end if;
  if coalesce(trim(e.assureur_decennale), '') = '' or coalesce(trim(e.police_decennale), '') = '' then
    raise exception 'Renseignez votre assurance décennale dans Paramètres (mention obligatoire pour les travaux).';
  end if;
  if e.franchise_tva
     and exists (select 1 from devis_lignes where devis_id = d.id and taux_tva <> 0) then
    raise exception 'Vous êtes en franchise de TVA : toutes les lignes doivent être à 0 %%.';
  end if;

  select * into c from clients where id = d.client_id;

  v_numero := d.numero;
  if v_numero is null then
    v_annee := extract(year from v_jour)::integer;
    insert into compteurs_devis (owner_id, annee, dernier)
    values (d.owner_id, v_annee, 1)
    on conflict (owner_id, annee) do update set dernier = compteurs_devis.dernier + 1
    returning dernier into v_num;
    v_numero := e.prefixe_devis || '-' || v_annee || '-' || lpad(v_num::text, 4, '0');
  end if;

  perform set_config('novara.devis', 'on', true);

  update devis set
    statut = 'envoye',
    numero = v_numero,
    date_emission = v_jour,
    -- Validité : saisie si elle tombe après la date d'envoi, sinon le délai des réglages.
    date_validite = case when d.date_validite is not null and d.date_validite > v_jour
                         then d.date_validite else v_jour + e.validite_devis_jours end,
    emetteur = to_jsonb(e) - 'owner_id' - 'updated_at',
    destinataire = to_jsonb(c) - 'owner_id' - 'notes' - 'created_at' - 'id'
  where id = d.id
  returning * into d;

  perform set_config('novara.devis', 'off', true);
  return d;
end $$;

-- Réponse du client : accepté ou refusé.
create function public.repondre_devis(p_devis_id uuid, p_accepte boolean, p_date date default null)
returns public.devis
language plpgsql security invoker set search_path = public as $$
declare
  d devis;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  select * into d from devis where id = p_devis_id for update;
  if not found then
    raise exception 'Devis introuvable.';
  end if;
  if d.statut <> 'envoye' then
    raise exception 'Seul un devis envoyé peut être accepté ou refusé.';
  end if;
  update devis set
    statut = case when p_accepte then 'accepte' else 'refuse' end,
    date_reponse = coalesce(p_date, (now() at time zone 'Europe/Paris')::date)
  where id = d.id
  returning * into d;
  return d;
end $$;

-- Rouvrir un devis accepté ou refusé par erreur (sans facture ni acompte).
create function public.rouvrir_devis(p_devis_id uuid) returns public.devis
language plpgsql security invoker set search_path = public as $$
declare
  d devis;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  update devis set statut = 'envoye', date_reponse = null
  where id = p_devis_id and statut in ('accepte', 'refuse')
  returning * into d;
  if not found then
    raise exception 'Seul un devis accepté ou refusé peut être rouvert.';
  end if;
  return d;
end $$;

-- Acompte sur un devis : facture d'acompte (brouillon) rattachée au devis.
-- Montant : un pourcentage du devis, ou un montant TTC précis. Une ligne par
-- taux de TVA du devis, au prorata. Le devis passe en « accepté ».
create function public.creer_acompte_devis(p_devis_id uuid, p_pourcentage numeric default null,
                                           p_montant_ttc numeric default null)
returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  d devis;
  v_facture uuid;
  v_ratio numeric;
  v_pct text;
  v_position integer := 0;
  v_taux record;
  v_nb_taux integer;
  v_deja numeric(12, 2);
  v_titre text;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  select * into d from devis where id = p_devis_id for update;
  if not found then
    raise exception 'Devis introuvable.';
  end if;
  if d.statut not in ('envoye', 'accepte') then
    raise exception 'Envoyez d''abord le devis (il lui faut un numéro).';
  end if;
  if d.facture_id is not null then
    raise exception 'Ce devis est déjà facturé.';
  end if;
  if d.total_ttc <= 0 then
    raise exception 'Le devis est vide.';
  end if;

  if p_montant_ttc is not null then
    if p_montant_ttc <= 0 then
      raise exception 'Le montant de l''acompte doit être positif.';
    end if;
    v_ratio := p_montant_ttc / d.total_ttc;
  elsif p_pourcentage is not null then
    if p_pourcentage <= 0 or p_pourcentage > 100 then
      raise exception 'Le pourcentage doit être entre 1 et 100.';
    end if;
    v_ratio := p_pourcentage / 100;
  else
    raise exception 'Indiquez un pourcentage ou un montant.';
  end if;

  -- Acomptes déjà demandés (hors brouillons et acomptes annulés par avoir).
  select coalesce(sum(a.total_ttc), 0) into v_deja
  from factures a
  where a.devis_id = d.id and a.type = 'acompte' and a.statut <> 'brouillon'
    and not exists (select 1 from factures av where av.type = 'avoir'
                    and av.facture_origine_id = a.id and av.statut <> 'brouillon');
  if v_deja + round(d.total_ttc * v_ratio, 2) > d.total_ttc then
    raise exception 'Avec cet acompte, les acomptes dépasseraient le total du devis (déjà demandés : % €).', v_deja;
  end if;

  if d.statut = 'envoye' then
    update devis set statut = 'accepte',
                     date_reponse = (now() at time zone 'Europe/Paris')::date
    where id = d.id;
  end if;

  v_pct := replace(trim(trailing '.' from trim(trailing '0' from round(v_ratio * 100, 2)::text)), '.', ',');
  v_titre := coalesce(nullif(trim(d.objet), ''), 'travaux');

  insert into factures (owner_id, type, client_id, chantier_id, devis_id, objet,
                        periode_travaux, lieu_travaux, nature_operation, mention_tva)
  values (d.owner_id, 'acompte', d.client_id, d.chantier_id, d.id,
          'Acompte sur le devis ' || d.numero || ' — ' || v_titre,
          d.periode_travaux, d.lieu_travaux, d.nature_operation, d.mention_tva)
  returning id into v_facture;

  select count(distinct taux_tva) into v_nb_taux from devis_lignes where devis_id = d.id;

  for v_taux in
    select taux_tva, sum(round(quantite * prix_unitaire_ht, 2)) as ht
    from devis_lignes where devis_id = d.id
    group by taux_tva order by taux_tva desc
  loop
    v_position := v_position + 1;
    insert into facture_lignes (owner_id, facture_id, position, designation, quantite, prix_unitaire_ht, taux_tva)
    values (
      d.owner_id, v_facture, v_position,
      case when p_montant_ttc is not null
           then 'Acompte sur le devis ' || d.numero || ' du ' || to_char(d.date_emission, 'DD/MM/YYYY')
           else 'Acompte de ' || v_pct || ' % sur le devis ' || d.numero || ' du '
                || to_char(d.date_emission, 'DD/MM/YYYY') end
        || case when v_nb_taux > 1 then ' (part TVA ' || replace(trim(trailing '.' from trim(trailing '0' from v_taux.taux_tva::text)), '.', ',') || ' %)' else '' end,
      1,
      -- Montant précis sur un devis à un seul taux : HT tiré du TTC demandé.
      case when p_montant_ttc is not null and v_nb_taux = 1
           then round(p_montant_ttc / (1 + v_taux.taux_tva / 100), 2)
           else round(v_taux.ht * v_ratio, 2) end,
      v_taux.taux_tva
    );
  end loop;

  return v_facture;
end $$;

-- Transformer en facture : brouillon de facture finale reprenant les lignes du
-- devis. Les acomptes du devis seront déduits à son émission.
create function public.transformer_devis(p_devis_id uuid) returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  d devis;
  v_facture uuid;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  select * into d from devis where id = p_devis_id for update;
  if not found then
    raise exception 'Devis introuvable.';
  end if;
  if d.statut not in ('envoye', 'accepte') then
    raise exception 'Seul un devis envoyé ou accepté peut être transformé en facture.';
  end if;
  if d.facture_id is not null then
    raise exception 'Ce devis a déjà sa facture.';
  end if;

  if d.statut = 'envoye' then
    update devis set statut = 'accepte',
                     date_reponse = (now() at time zone 'Europe/Paris')::date
    where id = d.id;
  end if;

  insert into factures (owner_id, type, client_id, chantier_id, devis_id, objet,
                        periode_travaux, lieu_travaux, nature_operation, mention_tva)
  values (d.owner_id, 'facture', d.client_id, d.chantier_id, d.id, d.objet,
          null, d.lieu_travaux, d.nature_operation, d.mention_tva)
  returning id into v_facture;

  insert into facture_lignes (owner_id, facture_id, position, designation, quantite, unite, prix_unitaire_ht, taux_tva)
  select owner_id, v_facture, position, designation, quantite, unite, prix_unitaire_ht, taux_tva
  from devis_lignes where devis_id = d.id;

  update devis set facture_id = v_facture where id = d.id;
  return v_facture;
end $$;

-- 5. Factures : acomptes du devis, acomptes annulés -------------------------------

-- Acomptes à déduire d'une facture finale :
--   * facture issue d'un devis : les acomptes de ce devis, plus ceux du même
--     chantier qui ne sont rattachés à aucun devis ;
--   * sinon : les acomptes du chantier (comme avant) ;
--   * jamais un acompte annulé par un avoir émis.
create function public.acomptes_a_deduire(p_facture_id uuid)
returns setof public.factures
language sql stable security invoker set search_path = public as $$
  select a.*
  from factures f
  join factures a on a.type = 'acompte' and a.statut <> 'brouillon' and a.deduit_sur is null
                 and a.client_id = f.client_id and a.id <> f.id
  where f.id = p_facture_id and f.type = 'facture'
    and (
      (f.devis_id is not null and a.devis_id = f.devis_id)
      or (f.chantier_id is not null and a.chantier_id = f.chantier_id
          and (a.devis_id is null or a.devis_id = f.devis_id))
    )
    and not exists (select 1 from factures av where av.type = 'avoir'
                    and av.facture_origine_id = a.id and av.statut <> 'brouillon')
  order by a.date_emission, a.numero;
$$;

create or replace function public.emettre_facture(p_facture_id uuid) returns public.factures
language plpgsql security invoker set search_path = public as $$
declare
  f factures;
  e entreprise;
  c clients;
  ch chantiers;
  v_annee integer;
  v_num integer;
  v_jour date := (now() at time zone 'Europe/Paris')::date;
  v_periode text;
  v_lieu text;
  v_adresse_client text;
  v_acomptes jsonb;
  v_ids uuid[];
  v_total_acomptes numeric(12, 2) := 0;
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
  if c.type = 'professionnel' and coalesce(trim(c.siret), '') = '' then
    raise exception 'Client professionnel : renseignez son SIRET (son SIREN doit figurer sur la facture).';
  end if;

  if f.chantier_id is not null then
    select * into ch from chantiers where id = f.chantier_id;
  end if;

  v_periode := nullif(trim(coalesce(f.periode_travaux, '')), '');
  if v_periode is null and ch.id is not null and ch.date_debut is not null and ch.date_fin is not null then
    v_periode := 'du ' || to_char(ch.date_debut, 'DD/MM/YYYY') || ' au ' || to_char(ch.date_fin, 'DD/MM/YYYY');
  elsif v_periode is null and ch.id is not null and ch.date_fin is not null then
    v_periode := 'terminés le ' || to_char(ch.date_fin, 'DD/MM/YYYY');
  end if;
  if v_periode is null and f.type = 'facture' then
    raise exception 'Indiquez la date ou la période des travaux (mention obligatoire).';
  end if;

  v_lieu := nullif(trim(coalesce(f.lieu_travaux, '')), '');
  if v_lieu is null and ch.id is not null then
    v_lieu := nullif(concat_ws(', ', nullif(trim(ch.adresse), ''),
                     nullif(trim(concat_ws(' ', ch.code_postal, ch.ville)), '')), '');
    v_adresse_client := concat_ws(', ', nullif(trim(c.adresse), ''),
                        nullif(trim(concat_ws(' ', c.code_postal, c.ville)), ''));
    if lower(coalesce(v_lieu, '')) = lower(coalesce(v_adresse_client, '')) then
      v_lieu := null;
    end if;
  end if;

  -- Facture finale : déduire les acomptes (du devis et/ou du chantier).
  if f.type = 'facture' and (f.chantier_id is not null or f.devis_id is not null) then
    select jsonb_agg(jsonb_build_object('id', a.id, 'numero', a.numero, 'date', a.date_emission,
                                        'ttc', a.total_ttc) order by a.date_emission, a.numero),
           coalesce(sum(a.total_ttc), 0),
           array_agg(a.id)
    into v_acomptes, v_total_acomptes, v_ids
    from acomptes_a_deduire(f.id) a;

    if v_total_acomptes > f.total_ttc then
      raise exception 'Les acomptes versés (% €) dépassent le total de la facture.', v_total_acomptes;
    end if;

    if v_ids is not null then
      update factures set deduit_sur = f.id where id = any (v_ids);
    end if;
  end if;

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
    periode_travaux = v_periode,
    lieu_travaux = v_lieu,
    acomptes = v_acomptes,
    net_a_payer = f.total_ttc - v_total_acomptes,
    emetteur = to_jsonb(e) - 'owner_id' - 'updated_at',
    destinataire = to_jsonb(c) - 'owner_id' - 'notes' - 'created_at' - 'id'
  where id = f.id
  returning * into f;

  perform set_config('novara.emission', 'off', true);
  return f;
end $$;

-- L'avoir garde le lien avec le devis (annulation d'un acompte du devis).
create or replace function public.creer_avoir(p_facture_id uuid) returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  f factures;
  v_avoir uuid;
begin
  if not est_admin() then
    raise exception 'Accès refusé.';
  end if;
  select * into f from factures where id = p_facture_id;
  if not found or f.statut = 'brouillon' or f.type = 'avoir' then
    raise exception 'Un avoir se fait sur une facture émise.';
  end if;

  insert into factures (owner_id, type, facture_origine_id, client_id, chantier_id, devis_id, objet,
                        periode_travaux, mention_tva, nature_operation, lieu_travaux)
  values (f.owner_id, 'avoir', f.id, f.client_id, f.chantier_id, f.devis_id,
          'Avoir sur la facture ' || f.numero, f.periode_travaux, f.mention_tva,
          f.nature_operation, f.lieu_travaux)
  returning id into v_avoir;

  insert into facture_lignes (owner_id, facture_id, position, designation, quantite, unite, prix_unitaire_ht, taux_tva)
  select owner_id, v_avoir, position, designation, quantite, unite, -prix_unitaire_ht, taux_tva
  from facture_lignes where facture_id = f.id;

  return v_avoir;
end $$;

-- 6. Droits et sécurité ----------------------------------------------------------

revoke all on function public.recalculer_totaux_devis(uuid) from public, anon;
revoke all on function public.envoyer_devis(uuid) from public, anon;
revoke all on function public.repondre_devis(uuid, boolean, date) from public, anon;
revoke all on function public.rouvrir_devis(uuid) from public, anon;
revoke all on function public.creer_acompte_devis(uuid, numeric, numeric) from public, anon;
revoke all on function public.transformer_devis(uuid) from public, anon;
revoke all on function public.acomptes_a_deduire(uuid) from public, anon;
grant execute on function public.recalculer_totaux_devis(uuid) to authenticated;
grant execute on function public.envoyer_devis(uuid) to authenticated;
grant execute on function public.repondre_devis(uuid, boolean, date) to authenticated;
grant execute on function public.rouvrir_devis(uuid) to authenticated;
grant execute on function public.creer_acompte_devis(uuid, numeric, numeric) to authenticated;
grant execute on function public.transformer_devis(uuid) to authenticated;
grant execute on function public.acomptes_a_deduire(uuid) to authenticated;

alter table public.devis enable row level security;
alter table public.devis_lignes enable row level security;
alter table public.compteurs_devis enable row level security;

create policy "admin" on public.devis for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin" on public.devis_lignes for all to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()))
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin lecture" on public.compteurs_devis for select to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin ecriture" on public.compteurs_devis for insert to authenticated
  with check (owner_id = (select auth.uid()) and (select public.est_admin()));
create policy "admin maj" on public.compteurs_devis for update to authenticated
  using (owner_id = (select auth.uid()) and (select public.est_admin()));

commit;
