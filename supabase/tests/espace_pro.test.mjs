import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const migration = readFileSync(new URL("../migrations/20260921000001_espace_pro.sql", import.meta.url), "utf8");
const db = new PGlite();

// Minimal Supabase stand-ins: auth.users, auth.uid(), roles, storage.
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.sub', true), '')::uuid $$;
  create table storage.buckets (id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema public, auth, storage to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
  grant all on storage.objects to anon, authenticated;
  insert into auth.users values
    ('11111111-1111-1111-1111-111111111111', 'admin@test'),
    ('22222222-2222-2222-2222-222222222222', 'ancien@test');
`);

await db.exec(migration);
await db.exec(`insert into public.app_admin values ('11111111-1111-1111-1111-111111111111');`);

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
  if (!cond) failures++;
};

async function as(user, fn) {
  await db.exec("begin");
  try {
    if (user === "anon") {
      await db.exec(`set local role anon; select set_config('request.jwt.sub', '', true);`);
    } else {
      await db.exec(`set local role authenticated; select set_config('request.jwt.sub', '${user}', true);`);
    }
    const r = await fn();
    await db.exec("commit");
    return r;
  } catch (e) {
    await db.exec("rollback");
    throw e;
  }
}
async function expectError(name, user, sql, pattern) {
  try {
    await as(user, () => db.query(sql));
    ok(name, false, "aucune erreur");
  } catch (e) {
    ok(name, pattern.test(e.message), e.message);
  }
}

const ADMIN = "11111111-1111-1111-1111-111111111111";
const OTHER = "22222222-2222-2222-2222-222222222222";
const q1 = async (user, sql, params) => (await as(user, () => db.query(sql, params))).rows;

// Données de base
const [client] = await q1(ADMIN, `insert into clients (nom, adresse, ville) values ('Mme Dupont', '3 rue X', 'Nice') returning id`);
const [chantier] = await q1(ADMIN, `insert into chantiers (titre, client_id) values ('Salle de bain', $1) returning id`, [client.id]);
await q1(ADMIN, `insert into chantier_commentaires (chantier_id, contenu) values ($1, 'Carrelage posé')`, [chantier.id]);

// Isolation
ok("autre compte ne voit aucun client", (await q1(OTHER, `select * from clients`)).length === 0);
ok("anonyme ne voit aucun chantier", (await q1("anon", `select * from chantiers`)).length === 0);
await expectError("autre compte ne peut pas créer de client", OTHER, `insert into clients (nom) values ('Pirate')`, /row-level security/);

// Facture brouillon + totaux
const [f] = await q1(ADMIN, `insert into factures (client_id, chantier_id, objet) values ($1, $2, 'Rénovation SDB') returning id`, [client.id, chantier.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation, quantite, prix_unitaire_ht, taux_tva) values
  ($1, 'Carrelage', 12.5, 45.33, 10), ($1, 'Main d''oeuvre', 1, 1200, 10), ($1, 'Robinet', 1, 89.99, 20)`, [f.id]);
let [t] = await q1(ADMIN, `select total_ht, total_tva, total_ttc from factures where id = $1`, [f.id]);
// 12.5*45.33 = 566.625 -> 566.63 ; HT 10% = 1766.63 -> TVA 176.66 ; 20% 89.99 -> 18.00 ; HT 1856.62 TVA 194.66 TTC 2051.28
ok("totaux calculés", t.total_ht === "1856.62" && t.total_tva === "194.66" && t.total_ttc === "2051.28", JSON.stringify(t));

// Émission refusée sans infos entreprise
await expectError("émission refusée sans entreprise", ADMIN, `select emettre_facture('${f.id}')`, /Paramètres/);
await q1(ADMIN, `insert into entreprise (raison_sociale, adresse, ville, siret, tva_intracom) values ('NOVARA Habitat', '1 av Y', 'Nice', '12345678900011', 'FR00123456789')`);
await expectError("émission refusée sans décennale", ADMIN, `select emettre_facture('${f.id}')`, /décennale/);
await q1(ADMIN, `update entreprise set assureur_decennale = 'AXA', police_decennale = 'P-1'`);
await expectError("émission refusée : taux réduit sans mention", ADMIN, `select emettre_facture('${f.id}')`, /attestation/);
await q1(ADMIN, `update factures set mention_tva = 'TVA 10 % — attestation client du 01/09/2026' where id = $1`, [f.id]);
await expectError("statut émis direct interdit", ADMIN, `update factures set statut = 'emise', numero = 'X' where id = '${f.id}'`, /Émettre/);
await expectError("payée sans émission interdit", ADMIN, `update factures set statut = 'payee' where id = '${f.id}'`, /émise avant/);

const [em] = await q1(ADMIN, `select * from emettre_facture($1)`, [f.id]);
const annee = new Date().getFullYear();
ok("numéro attribué", em.numero === `F-${annee}-0001`, em.numero);
ok("coordonnées figées", em.emetteur?.raison_sociale === "NOVARA Habitat" && em.destinataire?.nom === "Mme Dupont");
ok("échéance = émission + 30 j", new Date(em.date_echeance) - new Date(em.date_emission) === 30 * 864e5);

// Immutabilité
await expectError("ligne d'une facture émise non modifiable", ADMIN, `update facture_lignes set prix_unitaire_ht = 1 where facture_id = '${f.id}'`, /avoir/);
await expectError("ajout de ligne interdit après émission", ADMIN, `insert into facture_lignes (facture_id, designation) values ('${f.id}', 'x')`, /avoir/);
await expectError("objet non modifiable", ADMIN, `update factures set objet = 'autre' where id = '${f.id}'`, /avoir/);
await expectError("suppression interdite", ADMIN, `delete from factures where id = '${f.id}'`, /avoir/);
await expectError("réémission interdite", ADMIN, `select emettre_facture('${f.id}')`, /déjà émise/);
await q1(ADMIN, `update entreprise set raison_sociale = 'Nouveau nom'`);
[t] = await q1(ADMIN, `select emetteur->>'raison_sociale' as rs from factures where id = $1`, [f.id]);
ok("changer l'entreprise ne modifie pas la facture émise", t.rs === "NOVARA Habitat");
await q1(ADMIN, `update factures set statut = 'payee', date_paiement = current_date, mode_paiement = 'virement' where id = $1`, [f.id]);
ok("marquer payée autorisé", (await q1(ADMIN, `select statut from factures where id = $1`, [f.id]))[0].statut === "payee");

// Deuxième facture -> numéro suivant ; brouillon supprimable
const [f2] = await q1(ADMIN, `insert into factures (client_id) values ($1) returning id`, [client.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation, quantite, prix_unitaire_ht) values ($1, 'Dépannage', 1, 100)`, [f2.id]);
const [em2] = await q1(ADMIN, `select * from emettre_facture($1)`, [f2.id]);
ok("numérotation continue", em2.numero === `F-${annee}-0002`, em2.numero);
const [f3] = await q1(ADMIN, `insert into factures (client_id) values ($1) returning id`, [client.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation) values ($1, 'x')`, [f3.id]);
await q1(ADMIN, `delete from factures where id = $1`, [f3.id]);
ok("brouillon supprimable", (await q1(ADMIN, `select * from factures where id = $1`, [f3.id])).length === 0);

// Avoir
const [av] = await q1(ADMIN, `select creer_avoir($1) as id`, [f2.id]);
[t] = await q1(ADMIN, `select type, total_ttc, statut from factures where id = $1`, [av.id]);
ok("avoir négatif en brouillon", t.type === "avoir" && t.total_ttc === "-120.00" && t.statut === "brouillon", JSON.stringify(t));
const [emAv] = await q1(ADMIN, `select * from emettre_facture($1)`, [av.id]);
ok("avoir dans la même séquence", emAv.numero === `F-${annee}-0003`, emAv.numero);

// Reprise de numérotation
await expectError("numérotation figée une fois utilisée", ADMIN, `select fixer_dernier_numero(${annee}, 57)`, /déjà été émises/);
await q1(ADMIN, `select fixer_dernier_numero(${annee + 1}, 57)`);
ok("reprise de numérotation pour une année vierge", (await q1(ADMIN, `select dernier from compteurs_factures where annee = $1`, [annee + 1]))[0].dernier === 57);

// Autres comptes et anonymes
await expectError("autre compte ne peut pas émettre", OTHER, `select emettre_facture('${f2.id}')`, /Accès refusé/);
await expectError("anonyme ne peut pas émettre", "anon", `select emettre_facture('${f2.id}')`, /permission denied/);

// Demandes de contact
await q1("anon", `insert into demandes_contact (nom, telephone, message) values ('Client web', '0600000000', 'Devis cuisine')`);
ok("anonyme dépose une demande", true);
ok("anonyme ne relit pas les demandes", (await q1("anon", `select * from demandes_contact`)).length === 0);
ok("autre compte ne lit pas les demandes", (await q1(OTHER, `select * from demandes_contact`)).length === 0);
ok("admin lit les demandes", (await q1(ADMIN, `select * from demandes_contact`)).length === 1);
await expectError("demande sans contact refusée", "anon", `insert into demandes_contact (nom) values ('x')`, /check constraint/);

// Photos (storage)
await q1(ADMIN, `insert into storage.objects (bucket_id, name) values ('chantiers', 'a/b.jpg')`);
ok("admin dépose une photo", true);
ok("autre compte ne voit pas les photos", (await q1(OTHER, `select * from storage.objects`)).length === 0);
await expectError("autre compte ne dépose pas de photo", OTHER, `insert into storage.objects (bucket_id, name) values ('chantiers', 'x.jpg')`, /row-level security/);

// Suppression d'un chantier : la facture émise reste, sans lien
await q1(ADMIN, `delete from chantiers where id = $1`, [chantier.id]);
[t] = await q1(ADMIN, `select numero, chantier_id from factures where id = $1`, [f.id]);
ok("facture conservée si chantier supprimé", t.numero === `F-${annee}-0001` && t.chantier_id === null);
await expectError("client avec factures non supprimable", ADMIN, `delete from clients where id = '${client.id}'`, /foreign key/);

console.log(failures ? `\n${failures} ÉCHEC(S)` : "\nTOUS LES TESTS PASSENT");
process.exit(failures ? 1 : 0);
