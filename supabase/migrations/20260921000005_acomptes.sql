-- Factures d'acompte.
--
-- Un acompte encaissé se documente par une facture d'acompte : même séquence de
-- numéros, mêmes règles (émise = figée). La facture finale du chantier déduit
-- automatiquement, à son émission, les acomptes émis et non encore déduits :
-- son total reste celui des travaux, et « net à payer » = total - acomptes.

begin;

-- Nouveau type « acompte » ; seul l'avoir exige une facture d'origine.
do $$
declare
  r record;
begin
  for r in
    select conname from pg_constraint
    where conrelid = 'public.factures'::regclass and contype = 'c'
      and (pg_get_constraintdef(oid) like '%''avoir''%'
           or pg_get_constraintdef(oid) like '%facture_origine_id IS NOT NULL%')
  loop
    execute format('alter table public.factures drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.factures
  add constraint factures_type_check check (type in ('facture', 'avoir', 'acompte')),
  add constraint factures_origine_avoir check (type <> 'avoir' or facture_origine_id is not null),
  add column deduit_sur uuid references public.factures(id) on delete restrict,
  add column acomptes jsonb,
  add column net_a_payer numeric(12, 2);

create index factures_deduit_sur_idx on public.factures (deduit_sur);

create or replace function public.proteger_facture() returns trigger
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

  if new.statut = 'brouillon' then
    raise exception 'Une facture émise ne peut pas redevenir brouillon.';
  end if;
  -- Un acompte déduit ne peut plus être « dé-déduit ».
  if old.deduit_sur is not null and new.deduit_sur is distinct from old.deduit_sur then
    raise exception 'Cet acompte est déjà déduit d''une facture.';
  end if;
  if (new.type, new.facture_origine_id, new.client_id, new.numero, new.date_emission,
      new.date_echeance, new.objet, new.periode_travaux, new.mention_tva,
      new.total_ht, new.total_tva, new.total_ttc, new.emetteur, new.destinataire, new.owner_id,
      new.nature_operation, new.lieu_travaux, new.acomptes, new.net_a_payer)
     is distinct from
     (old.type, old.facture_origine_id, old.client_id, old.numero, old.date_emission,
      old.date_echeance, old.objet, old.periode_travaux, old.mention_tva,
      old.total_ht, old.total_tva, old.total_ttc, old.emetteur, old.destinataire, old.owner_id,
      old.nature_operation, old.lieu_travaux, old.acomptes, old.net_a_payer) then
    raise exception 'Une facture émise ne peut plus être modifiée. Faites un avoir.';
  end if;
  return new;
end $$;

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

  -- Facture finale d'un chantier : déduire les acomptes émis et pas encore déduits.
  if f.type = 'facture' and f.chantier_id is not null then
    select jsonb_agg(jsonb_build_object('id', a.id, 'numero', a.numero, 'date', a.date_emission,
                                        'ttc', a.total_ttc) order by a.date_emission, a.numero),
           coalesce(sum(a.total_ttc), 0)
    into v_acomptes, v_total_acomptes
    from factures a
    where a.type = 'acompte' and a.statut <> 'brouillon' and a.deduit_sur is null
      and a.chantier_id = f.chantier_id and a.client_id = f.client_id;

    if v_total_acomptes > f.total_ttc then
      raise exception 'Les acomptes versés (% €) dépassent le total de la facture.', v_total_acomptes;
    end if;

    update factures set deduit_sur = f.id
    where type = 'acompte' and statut <> 'brouillon' and deduit_sur is null
      and chantier_id = f.chantier_id and client_id = f.client_id;
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

-- Un avoir peut aussi annuler une facture d'acompte (remboursement).
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

  insert into factures (owner_id, type, facture_origine_id, client_id, chantier_id, objet,
                        periode_travaux, mention_tva, nature_operation, lieu_travaux)
  values (f.owner_id, 'avoir', f.id, f.client_id, f.chantier_id,
          'Avoir sur la facture ' || f.numero, f.periode_travaux, f.mention_tva,
          f.nature_operation, f.lieu_travaux)
  returning id into v_avoir;

  insert into facture_lignes (owner_id, facture_id, position, designation, quantite, unite, prix_unitaire_ht, taux_tva)
  select owner_id, v_avoir, position, designation, quantite, unite, -prix_unitaire_ht, taux_tva
  from facture_lignes where facture_id = f.id;

  return v_avoir;
end $$;

commit;
