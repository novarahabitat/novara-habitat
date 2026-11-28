-- Devis : l'assurance décennale n'est plus exigée pour finaliser un devis
-- (la mention reste imprimée sur le PDF quand elle est renseignée).
-- Les conditions de paiement sont toujours inscrites sur le devis : si le champ
-- du devis est vide, on reprend celles des Réglages au moment de la finalisation.

create or replace function public.envoyer_devis(p_devis_id uuid) returns public.devis
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
    conditions = coalesce(nullif(trim(d.conditions), ''), e.conditions_paiement),
    emetteur = to_jsonb(e) - 'owner_id' - 'updated_at',
    destinataire = to_jsonb(c) - 'owner_id' - 'notes' - 'created_at' - 'id'
  where id = d.id
  returning * into d;

  perform set_config('novara.devis', 'off', true);
  return d;
end $$;
