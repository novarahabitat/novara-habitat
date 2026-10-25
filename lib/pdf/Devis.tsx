import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Client, Devis, Entreprise, LigneDevis } from "@/lib/types";
import { adresseComplete, formatDate, formatEuros, formatNombre, libelleNature } from "@/lib/format";
import { estEI, mentionsTva, nomEmetteur } from "@/lib/facture";
import { LOGO_PDF } from "./logo";
import { base, couleurs } from "./styles";

const s = StyleSheet.create({
  entete: { flexDirection: "row", justifyContent: "space-between", marginBottom: 26 },
  logo: { width: 130 },
  emetteur: { width: 220, textAlign: "right" },
  blocs: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  titre: { fontSize: 19, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: couleurs.foret, marginBottom: 8 },
  destinataire: { width: 230, padding: 12, backgroundColor: couleurs.creme, borderRadius: 4 },
  table: { marginTop: 8 },
  ligneTete: {
    flexDirection: "row",
    backgroundColor: couleurs.foret,
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  ligne: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: couleurs.filet,
  },
  cDesignation: { flex: 1, paddingRight: 8 },
  cQte: { width: 50, textAlign: "right" },
  cUnite: { width: 34, textAlign: "left", paddingLeft: 4 },
  cPu: { width: 64, textAlign: "right" },
  cTva: { width: 36, textAlign: "right" },
  cTotal: { width: 70, textAlign: "right" },
  totaux: { marginTop: 12, marginLeft: "auto", width: 220 },
  totalLigne: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: couleurs.foret,
    color: "white",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  mentions: { marginTop: 22, gap: 6 },
  cadre: { borderWidth: 0.5, borderColor: couleurs.filet, borderRadius: 4, padding: 10 },
  signatures: { flexDirection: "row", gap: 16, marginTop: 18 },
  signature: { flex: 1, height: 96, borderWidth: 0.5, borderColor: couleurs.gris, borderRadius: 4, padding: 8 },
  filigrane: {
    position: "absolute",
    top: 330,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 60,
    color: "#d9d3c7",
    transform: "rotate(-30deg)",
    opacity: 0.6,
  },
});

type Props = {
  devis: Devis;
  lignes: LigneDevis[];
  entreprise: Partial<Entreprise>;
  client: Partial<Client>;
};

export function DevisPdf({ devis, lignes, entreprise: e, client: c }: Props) {
  const brouillon = devis.statut === "brouillon";
  const franchise = Boolean(e.franchise_tva);
  const nom = nomEmetteur(e);

  const parTaux = new Map<number, number>();
  for (const l of lignes) {
    const ht = Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100;
    parTaux.set(Number(l.taux_tva), (parTaux.get(Number(l.taux_tva)) ?? 0) + ht);
  }

  const identite = [
    estEI(e) ? null : e.forme_juridique && e.capital ? `${e.forme_juridique} au capital de ${e.capital}` : e.forme_juridique,
    e.siret && `SIREN ${e.siret.replace(/\s/g, "").slice(0, 9)} · SIRET ${e.siret}`,
    e.rcs,
    e.tva_intracom && `TVA ${e.tva_intracom}`,
  ].filter(Boolean);

  return (
    <Document title={`Devis ${devis.numero ?? "brouillon"}`} author={nom || "NOVARA Habitat"}>
      <Page size="A4" style={base.page}>
        {brouillon && <Text style={s.filigrane}>BROUILLON</Text>}

        <View style={s.entete}>
          <Image src={LOGO_PDF} style={s.logo} />
          <View style={s.emetteur}>
            <Text style={base.gras}>{nom}</Text>
            <Text>{e.adresse}</Text>
            <Text>{[e.code_postal, e.ville].filter(Boolean).join(" ")}</Text>
            {e.telephone && <Text>Tél. {e.telephone}</Text>}
            {e.email && <Text>{e.email}</Text>}
            {identite.map((ligne) => (
              <Text key={ligne as string} style={base.petit}>
                {ligne}
              </Text>
            ))}
          </View>
        </View>

        <View style={s.blocs}>
          <View style={{ flex: 1, paddingRight: 18 }}>
            <Text style={s.titre}>Devis {devis.numero ?? ""}</Text>
            <Text>Date : {brouillon ? "à l'envoi" : formatDate(devis.date_emission)}</Text>
            {devis.date_validite && <Text>Valable jusqu&apos;au : {formatDate(devis.date_validite)}</Text>}
            {devis.periode_travaux && <Text>Début et durée des travaux : {devis.periode_travaux}</Text>}
            <Text>Nature : {libelleNature[devis.nature_operation ?? "prestation_services"]}</Text>
            {devis.lieu_travaux && <Text>Lieu des travaux : {devis.lieu_travaux}</Text>}
          </View>
          <View style={s.destinataire}>
            <Text style={[base.surtitre, { marginBottom: 4 }]}>Client</Text>
            {c.societe && <Text style={base.gras}>{c.societe}</Text>}
            <Text style={c.societe ? {} : base.gras}>{c.nom}</Text>
            <Text>{c.adresse}</Text>
            <Text>{[c.code_postal, c.ville].filter(Boolean).join(" ")}</Text>
            {c.telephone && <Text style={base.petit}>Tél. {c.telephone}</Text>}
            {c.siret && (
              <Text style={base.petit}>
                SIREN {c.siret.replace(/\s/g, "").slice(0, 9)} (SIRET {c.siret})
              </Text>
            )}
          </View>
        </View>

        {devis.objet && (
          <Text style={{ marginBottom: 6 }}>
            <Text style={base.gras}>Objet : </Text>
            {devis.objet}
          </Text>
        )}

        <View style={s.table}>
          <View style={s.ligneTete} fixed>
            <Text style={s.cDesignation}>Désignation</Text>
            <Text style={s.cQte}>Qté</Text>
            <Text style={s.cUnite}>Unité</Text>
            <Text style={s.cPu}>{franchise ? "Prix unit." : "PU HT"}</Text>
            {!franchise && <Text style={s.cTva}>TVA</Text>}
            <Text style={s.cTotal}>{franchise ? "Total" : "Total HT"}</Text>
          </View>
          {lignes.map((l) => (
            <View key={l.id} style={s.ligne} wrap={false}>
              <Text style={s.cDesignation}>{l.designation}</Text>
              <Text style={s.cQte}>{formatNombre(l.quantite)}</Text>
              <Text style={s.cUnite}>{l.unite ?? ""}</Text>
              <Text style={s.cPu}>{formatEuros(l.prix_unitaire_ht)}</Text>
              {!franchise && <Text style={s.cTva}>{formatNombre(l.taux_tva)} %</Text>}
              <Text style={s.cTotal}>
                {formatEuros(Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100)}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.totaux} wrap={false}>
          {!franchise && (
            <View style={s.totalLigne}>
              <Text>Total HT</Text>
              <Text>{formatEuros(devis.total_ht)}</Text>
            </View>
          )}
          {!franchise &&
            [...parTaux.entries()]
              .sort((a, b) => b[0] - a[0])
              .map(([taux, ht]) => (
                <View key={taux} style={s.totalLigne}>
                  <Text>
                    TVA {formatNombre(taux)} % sur {formatEuros(ht)}
                  </Text>
                  <Text>{formatEuros(Math.round(ht * taux) / 100)}</Text>
                </View>
              ))}
          <View style={s.totalFinal}>
            <Text>{franchise ? "Total" : "Total TTC"}</Text>
            <Text>{formatEuros(devis.total_ttc)}</Text>
          </View>
        </View>

        <View style={s.mentions} wrap={false}>
          {mentionsTva(devis, e).map((m) => (
            <Text key={m} style={base.gras}>
              {m}
            </Text>
          ))}
          <View style={s.cadre}>
            {devis.conditions && (
              <Text>
                <Text style={base.gras}>Conditions de paiement : </Text>
                {devis.conditions}
              </Text>
            )}
            {e.iban && (
              <Text>
                Règlement par virement — IBAN : {e.iban}
                {e.bic ? `   BIC : ${e.bic}` : ""}
              </Text>
            )}
            <Text style={[base.petit, { marginTop: 4 }]}>
              Devis gratuit. Prix établis pour les travaux décrits ci-dessus ; tout travail supplémentaire fera l&apos;objet
              d&apos;un avenant ou d&apos;un nouveau devis.
            </Text>
          </View>
          {e.assureur_decennale && (
            <Text style={base.petit}>
              Assurance responsabilité civile décennale : {e.assureur_decennale}, contrat n° {e.police_decennale}
              {e.zone_couverture ? `, couverture géographique : ${e.zone_couverture}` : ""}.
            </Text>
          )}
          {e.mentions_libres && <Text style={base.petit}>{e.mentions_libres}</Text>}

          <View style={s.signatures}>
            <View style={s.signature}>
              <Text style={base.petit}>L&apos;entreprise</Text>
              <Text style={[base.gras, { marginTop: 2 }]}>{nom}</Text>
            </View>
            <View style={s.signature}>
              <Text style={base.petit}>Le client — date, signature et mention manuscrite :</Text>
              <Text style={[base.petit, { marginTop: 2 }]}>« Devis reçu avant l&apos;exécution des travaux, bon pour accord »</Text>
            </View>
          </View>
        </View>

        <Text style={base.pied} fixed>
          {`${nom} · ${adresseComplete(e)}${e.siret ? ` · SIRET ${e.siret}` : ""}   —   Devis ${devis.numero ?? "brouillon"}`}
        </Text>
      </Page>
    </Document>
  );
}
