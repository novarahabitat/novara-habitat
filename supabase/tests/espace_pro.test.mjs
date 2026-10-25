import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

const migrations = [
  "20260921000001_espace_pro.sql",
  "20260921000004_mentions_septembre_2026.sql",
  "20260921000005_acomptes.sql",
  "20261025000006_devis.sql",
].map((f) => readFileSync(new URL(`../migrations/${f}`, import.meta.url), "utf8"));
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

for (const m of migrations) await db.exec(m);
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
await expectError("date des travaux obligatoire", ADMIN, `select emettre_facture('${f.id}')`, /période des travaux/);
await q1(ADMIN, `update chantiers set date_debut = '2026-09-02', date_fin = '2026-09-18', adresse = '8 chemin Y', ville = 'Nice' where id = $1`, [chantier.id]);
await expectError("statut émis direct interdit", ADMIN, `update factures set statut = 'emise', numero = 'X' where id = '${f.id}'`, /Émettre/);
await expectError("payée sans émission interdit", ADMIN, `update factures set statut = 'payee' where id = '${f.id}'`, /émise avant/);

const [em] = await q1(ADMIN, `select * from emettre_facture($1)`, [f.id]);
const annee = new Date().getFullYear();
ok("numéro attribué", em.numero === `F-${annee}-0001`, em.numero);
ok("coordonnées figées", em.emetteur?.raison_sociale === "NOVARA Habitat" && em.destinataire?.nom === "Mme Dupont");
ok("échéance = émission + 30 j", new Date(em.date_echeance) - new Date(em.date_emission) === 30 * 864e5);
ok("période reprise du chantier", em.periode_travaux === "du 02/09/2026 au 18/09/2026", em.periode_travaux);
ok("lieu des travaux = adresse du chantier", em.lieu_travaux === "8 chemin Y, Nice", em.lieu_travaux);
ok("nature par défaut : prestation de services", em.nature_operation === "prestation_services");
await expectError("nature non modifiable après émission", ADMIN, `update factures set nature_operation = 'mixte' where id = '${f.id}'`, /avoir/);

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
const [f2] = await q1(ADMIN, `insert into factures (client_id, periode_travaux) values ($1, 'le 20/09/2026') returning id`, [client.id]);
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

// Client professionnel sans SIRET
const [pro] = await q1(ADMIN, `insert into clients (nom, type, societe) values ('M. Martin', 'professionnel', 'SCI Martin') returning id`);
const [f4] = await q1(ADMIN, `insert into factures (client_id, periode_travaux) values ($1, 'le 21/09/2026') returning id`, [pro.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation, prix_unitaire_ht) values ($1, 'Diagnostic', 80)`, [f4.id]);
await expectError("SIREN du client pro obligatoire", ADMIN, `select emettre_facture('${f4.id}')`, /SIRET/);
await q1(ADMIN, `update clients set siret = '98765432100019' where id = $1`, [pro.id]);
const [em4] = await q1(ADMIN, `select * from emettre_facture($1)`, [f4.id]);
ok("facture pro émise avec SIRET client", em4.destinataire?.siret === "98765432100019" && em4.lieu_travaux === null);

// Acomptes : 30 % encaissé, puis facture finale qui le déduit
const [chA] = await q1(ADMIN, `insert into chantiers (titre, client_id, date_debut, date_fin) values ('Cuisine', $1, '2026-10-01', '2026-10-20') returning id`, [client.id]);
const [ac] = await q1(ADMIN, `insert into factures (type, client_id, chantier_id, periode_travaux) values ('acompte', $1, $2, 'à venir') returning id`, [client.id, chA.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation, prix_unitaire_ht, taux_tva) values ($1, 'Acompte de 30 %', 3000, 20)`, [ac.id]);
const [emAc] = await q1(ADMIN, `select * from emettre_facture($1)`, [ac.id]);
ok("facture d'acompte numérotée dans la série", /^F-\d{4}-\d{4}$/.test(emAc.numero) && emAc.total_ttc === "3600.00", emAc.numero + " " + emAc.total_ttc);
await q1(ADMIN, `update factures set statut = 'payee', date_paiement = current_date, mode_paiement = 'Virement' where id = $1`, [ac.id]);
const [fin] = await q1(ADMIN, `insert into factures (client_id, chantier_id) values ($1, $2) returning id`, [client.id, chA.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation, prix_unitaire_ht, taux_tva) values ($1, 'Cuisine complète', 10000, 20)`, [fin.id]);
const [emFin] = await q1(ADMIN, `select * from emettre_facture($1)`, [fin.id]);
ok("facture finale : total complet", emFin.total_ttc === "12000.00", emFin.total_ttc);
ok("facture finale : acompte déduit", emFin.net_a_payer === "8400.00" && emFin.acomptes?.length === 1 && emFin.acomptes[0].numero === emAc.numero, emFin.net_a_payer);
[t] = await q1(ADMIN, `select deduit_sur from factures where id = $1`, [ac.id]);
ok("acompte marqué déduit", t.deduit_sur === fin.id);
const [fin2] = await q1(ADMIN, `insert into factures (client_id, chantier_id) values ($1, $2) returning id`, [client.id, chA.id]);
await q1(ADMIN, `insert into facture_lignes (facture_id, designation, prix_unitaire_ht, taux_tva) values ($1, 'Supplément', 100, 20)`, [fin2.id]);
const [emFin2] = await q1(ADMIN, `select * from emettre_facture($1)`, [fin2.id]);
ok("un acompte n'est déduit qu'une fois", emFin2.net_a_payer === "120.00" && emFin2.acomptes === null, emFin2.net_a_payer);
await expectError("déduction non annulable", ADMIN, `update factures set deduit_sur = null where id = '${ac.id}'`, /déjà déduit/);
await expectError("net à payer figé", ADMIN, `update factures set net_a_payer = 1 where id = '${fin.id}'`, /avoir/);
const [avAc] = await q1(ADMIN, `select creer_avoir($1) as id`, [ac.id]);
ok("avoir possible sur un acompte", Boolean(avAc.id));
await expectError("avoir sans facture d'origine refusé", ADMIN, `insert into factures (type, client_id) values ('avoir', '${client.id}')`, /check constraint/);

// Devis : brouillon -> envoyé (numéroté, ajustable) -> accepté, acomptes, facture
const [chD] = await q1(ADMIN, `insert into chantiers (titre, client_id, date_debut, date_fin) values ('Salon', $1, '2026-11-02', '2026-11-20') returning id`, [client.id]);
const [dv] = await q1(ADMIN, `insert into devis (client_id, chantier_id, objet) values ($1, $2, 'Rénovation salon') returning id, numero, statut`, [client.id, chD.id]);
ok("devis brouillon sans numéro", dv.numero === null && dv.statut === "brouillon");
await expectError("devis vide non envoyable", ADMIN, `select envoyer_devis('${dv.id}')`, /aucune ligne/);
await q1(ADMIN, `insert into devis_lignes (devis_id, position, designation, quantite, prix_unitaire_ht, taux_tva) values ($1, 1, 'Peinture', 1, 1000, 10), ($1, 2, 'Plinthes', 1, 500, 20)`, [dv.id]);
[t] = await q1(ADMIN, `select total_ht, total_tva, total_ttc from devis where id = $1`, [dv.id]);
ok("totaux du devis", t.total_ht === "1500.00" && t.total_tva === "200.00" && t.total_ttc === "1700.00", JSON.stringify(t));
await expectError("devis : envoi manuel interdit", ADMIN, `update devis set statut = 'envoye', numero = 'X' where id = '${dv.id}'`, /ne se modifie pas|Envoyer/);
const [dvE] = await q1(ADMIN, `select * from envoyer_devis($1)`, [dv.id]);
ok("devis numéroté à l'envoi", dvE.numero === `D-${annee}-0001` && dvE.statut === "envoye", dvE.numero);
ok("validité = envoi + 30 j", new Date(dvE.date_validite) - new Date(dvE.date_emission) === 30 * 864e5);
await q1(ADMIN, `update devis_lignes set prix_unitaire_ht = 1200 where devis_id = $1 and position = 1`, [dv.id]);
[t] = await q1(ADMIN, `select total_ttc from devis where id = $1`, [dv.id]);
ok("devis envoyé ajustable", t.total_ttc === "1920.00", t.total_ttc);
const [dvE2] = await q1(ADMIN, `select * from envoyer_devis($1)`, [dv.id]);
ok("renvoi : même numéro", dvE2.numero === dvE.numero);
await expectError("numéro de devis figé", ADMIN, `update devis set numero = 'D-1' where id = '${dv.id}'`, /ne se modifie pas/);

const [dvR] = await q1(ADMIN, `insert into devis (client_id, objet) values ($1, 'Volets') returning id`, [client.id]);
await q1(ADMIN, `insert into devis_lignes (devis_id, designation, prix_unitaire_ht, taux_tva) values ($1, 'Volets', 800, 10)`, [dvR.id]);
await q1(ADMIN, `select envoyer_devis($1)`, [dvR.id]);
await q1(ADMIN, `select repondre_devis($1, false)`, [dvR.id]);
await expectError("devis refusé figé", ADMIN, `update devis_lignes set prix_unitaire_ht = 1 where devis_id = '${dvR.id}'`, /accepté ou refusé/);
await q1(ADMIN, `select rouvrir_devis($1)`, [dvR.id]);
ok("devis refusé rouvert", (await q1(ADMIN, `select statut from devis where id = $1`, [dvR.id]))[0].statut === "envoye");

// Acompte de 30 % : 1920 x 30 % = 576 (une ligne par taux)
const [acD] = await q1(ADMIN, `select creer_acompte_devis($1, 30) as id`, [dv.id]);
[t] = await q1(ADMIN, `select total_ttc, type, devis_id, chantier_id, (select count(*) from facture_lignes where facture_id = $1) as n from factures where id = $1`, [acD.id]);
ok("acompte de 30 % sur le devis", t.total_ttc === "576.00" && t.type === "acompte" && t.devis_id === dv.id && t.chantier_id === chD.id && Number(t.n) === 2, JSON.stringify(t));
ok("acompte : devis accepté", (await q1(ADMIN, `select statut from devis where id = $1`, [dv.id]))[0].statut === "accepte");
await expectError("devis accepté figé", ADMIN, `update devis set objet = 'autre' where id = '${dv.id}'`, /accepté ou refusé/);
await expectError("devis accepté non supprimable", ADMIN, `delete from devis where id = '${dv.id}'`, /accepté|foreign key/);
await q1(ADMIN, `update factures set mention_tva = 'TVA 10 % — attestation client' where id = $1`, [acD.id]);
await q1(ADMIN, `select emettre_facture($1)`, [acD.id]);
await q1(ADMIN, `update factures set statut = 'payee', date_paiement = current_date, mode_paiement = 'Virement' where id = $1`, [acD.id]);
await expectError("devis avec acompte non rouvrable", ADMIN, `select rouvrir_devis('${dv.id}')`, /factures/);
await expectError("acomptes plafonnés au devis", ADMIN, `select creer_acompte_devis('${dv.id}', null, 1500)`, /dépasseraient/);
const [acD2] = await q1(ADMIN, `select creer_acompte_devis($1, 10) as id`, [dv.id]);
await q1(ADMIN, `update factures set mention_tva = 'TVA 10 %' where id = $1`, [acD2.id]);
await q1(ADMIN, `select emettre_facture($1)`, [acD2.id]);
const [avD2] = await q1(ADMIN, `select creer_avoir($1) as id`, [acD2.id]);
await q1(ADMIN, `select emettre_facture($1)`, [avD2.id]);

// Transformation en facture : l'acompte payé est déduit, l'acompte annulé non
const [fD] = await q1(ADMIN, `select transformer_devis($1) as id`, [dv.id]);
[t] = await q1(ADMIN, `select total_ttc, statut, devis_id from factures where id = $1`, [fD.id]);
ok("facture issue du devis", t.total_ttc === "1920.00" && t.statut === "brouillon" && t.devis_id === dv.id, JSON.stringify(t));
await expectError("une seule facture par devis", ADMIN, `select transformer_devis('${dv.id}')`, /déjà sa facture/);
await q1(ADMIN, `update factures set mention_tva = 'TVA 10 %' where id = $1`, [fD.id]);
const [emD] = await q1(ADMIN, `select * from emettre_facture($1)`, [fD.id]);
ok("facture du devis : acompte déduit, acompte annulé ignoré", emD.net_a_payer === "1344.00" && emD.acomptes?.length === 1 && emD.periode_travaux === "du 02/11/2026 au 20/11/2026", `${emD.net_a_payer} ${emD.periode_travaux}`);
[t] = await q1(ADMIN, `select deduit_sur from factures where id = $1`, [acD2.id]);
ok("acompte annulé jamais déduit", t.deduit_sur === null);
await expectError("autre compte : devis invisible", OTHER, `select envoyer_devis('${dv.id}')`, /Accès refusé/);
ok("autre compte ne voit aucun devis", (await q1(OTHER, `select * from devis`)).length === 0);

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
