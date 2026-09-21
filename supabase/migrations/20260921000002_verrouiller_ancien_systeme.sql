-- Verrouillage des tables de l'ancien système (Brain, employés, biens, CRM…).
--
-- Ces tables n'ont pas de sécurité ligne par ligne : avec la clé publique du site,
-- n'importe qui peut les lire et les modifier. Le nouveau site ne s'en sert plus.
-- On active la sécurité sans aucune règle d'accès : les données restent intactes
-- (visibles dans le tableau de bord Supabase) mais plus aucune lecture ou écriture
-- n'est possible depuis Internet. Réversible : "alter table … disable row level security".
--
-- À exécuter APRÈS la mise en ligne du nouveau site (l'ancien site lit ces tables).

begin;

do $$
declare
  t record;
begin
  for t in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and not c.relrowsecurity
      and c.relname not in (
        'app_admin', 'entreprise', 'clients', 'chantiers', 'chantier_commentaires',
        'chantier_photos', 'factures', 'facture_lignes', 'compteurs_factures', 'demandes_contact'
      )
  loop
    execute format('alter table public.%I enable row level security', t.relname);
    raise notice 'Verrouillée : %', t.relname;
  end loop;
end $$;

-- Anciens espaces de fichiers publics (photos de projets, documents de biens) :
-- ils deviennent privés. Les fichiers restent dans le tableau de bord.
update storage.buckets set public = false where id <> 'chantiers' and public;

commit;
