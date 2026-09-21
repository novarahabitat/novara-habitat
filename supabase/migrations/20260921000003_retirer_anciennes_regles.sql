-- Retrait des règles d'accès de l'ancien système.
--
-- Après le verrouillage (migration 000002), ces règles laissaient encore :
--   * tout compte connecté lire les documents des employés et des biens (stockage) ;
--   * n'importe qui lire la table project_images.
-- L'ancien système ne tourne plus : on retire ces règles. Les fichiers et les
-- données restent en place, visibles dans le tableau de bord Supabase.
-- On garde « Users can read own profile » : chacun ne lit que sa propre ligne.

begin;

drop policy if exists "Users can read own profile for role routing" on public.profiles;
drop policy if exists "Admins can insert project images" on public.project_images;
drop policy if exists "Anyone can read project images" on public.project_images;
drop policy if exists "Admins can insert projects" on public.projects;

drop policy if exists "Admins can upload project images" on storage.objects;
drop policy if exists "Authenticated read property documents" on storage.objects;
drop policy if exists "Authenticated upload property documents" on storage.objects;
drop policy if exists "Authenticated upload property images" on storage.objects;
drop policy if exists "Authenticated users can read employee documents" on storage.objects;
drop policy if exists "Authenticated users can update employee documents" on storage.objects;
drop policy if exists "Authenticated users can upload employee documents" on storage.objects;
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public read property images" on storage.objects;

commit;
