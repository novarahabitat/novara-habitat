import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Client, Entreprise, Facture, LigneFacture } from "@/lib/types";
import { adresseComplete, formatDate, formatEuros, formatNombre, libelleNature } from "@/lib/format";
import { LOGO_PDF } from "./logo";
import { base, couleurs } from "./styles";

const s = StyleSheet.create({
  entete: { flexDirection: "row", justifyContent: "space-between", marginBottom: 26 },
  logo: { width: 130 },
  emetteur: { width: 220, textAlign: "right" },
  blocs: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  titre: { fontSize: 20, lineHeight: 1.2, fontFamily: "Helvetica-Bold", color: couleurs.foret, marginBottom: 8 },
  destinataire: {
    width: 230,
    padding: 12,
    backgroundColor: couleurs.creme,
    borderRadius: 4,
  },
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
  facture: Facture;
  lignes: LigneFacture[];
  entreprise: Partial<Entreprise>;
  client: Partial<Client>;
  origine?: { numero: string | null; date_emission: string | null } | null;
};

export function FacturePdf({ facture, lignes, entreprise: e, client: c, origine }: Props) {
  const brouillon = facture.statut === "brouillon";
  const libelle = facture.type === "avoir" ? "Avoir" : "Facture";

  const parTaux = new Map<number, number>();
  for (const l of lignes) {
    const ht = Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100;
    parTaux.set(Number(l.taux_tva), (parTaux.get(Number(l.taux_tva)) ?? 0) + ht);
  }

  const identite = [
    e.forme_juridique && e.capital ? `${e.forme_juridique} au capital de ${e.capital}` : e.forme_juridique,
    e.siret && `SIREN ${e.siret.replace(/\s/g, "").slice(0, 9)} · SIRET ${e.siret}`,
    e.rcs,
    e.tva_intracom && `TVA ${e.tva_intracom}`,
  ].filter(Boolean);

  return (
    <Document title={`${libelle} ${facture.numero ?? "brouillon"}`} author={e.raison_sociale ?? "NOVARA Habitat"}>
      <Page size="A4" style={base.page}>
        {brouillon && <Text style={s.filigrane}>BROUILLON</Text>}

        <View style={s.entete}>
          <Image src={LOGO_PDF} style={s.logo} />
          <View style={s.emetteur}>
            <Text style={base.gras}>{e.raison_sociale}</Text>
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
          <View>
            <Text style={s.titre}>
              {libelle} {facture.numero ?? ""}
            </Text>
            <Text>Date : {brouillon ? "à l'émission" : formatDate(facture.date_emission)}</Text>
            {facture.date_echeance && <Text>Échéance : {formatDate(facture.date_echeance)}</Text>}
            {facture.periode_travaux && <Text>Travaux réalisés : {facture.periode_travaux}</Text>}
            <Text>Nature : {libelleNature[facture.nature_operation ?? "prestation_services"]}</Text>
            {facture.lieu_travaux && <Text>Lieu des travaux : {facture.lieu_travaux}</Text>}
            {origine?.numero && (
              <Text>
                Annule et remplace la facture {origine.numero} du {formatDate(origine.date_emission)}
              </Text>
            )}
          </View>
          <View style={s.destinataire}>
            <Text style={[base.surtitre, { marginBottom: 4 }]}>Client</Text>
            {c.societe && <Text style={base.gras}>{c.societe}</Text>}
            <Text style={c.societe ? {} : base.gras}>{c.nom}</Text>
            <Text>{c.adresse}</Text>
            <Text>{[c.code_postal, c.ville].filter(Boolean).join(" ")}</Text>
            {c.siret && (
              <Text style={base.petit}>
                SIREN {c.siret.replace(/\s/g, "").slice(0, 9)} (SIRET {c.siret})
              </Text>
            )}
            {c.tva_intracom && <Text style={base.petit}>TVA {c.tva_intracom}</Text>}
          </View>
        </View>

        {facture.objet && (
          <Text style={{ marginBottom: 6 }}>
            <Text style={base.gras}>Objet : </Text>
            {facture.objet}
          </Text>
        )}

        <View style={s.table}>
          <View style={s.ligneTete} fixed>
            <Text style={s.cDesignation}>Désignation</Text>
            <Text style={s.cQte}>Qté</Text>
            <Text style={s.cUnite}>Unité</Text>
            <Text style={s.cPu}>PU HT</Text>
            <Text style={s.cTva}>TVA</Text>
            <Text style={s.cTotal}>Total HT</Text>
          </View>
          {lignes.map((l) => (
            <View key={l.id} style={s.ligne} wrap={false}>
              <Text style={s.cDesignation}>{l.designation}</Text>
              <Text style={s.cQte}>{formatNombre(l.quantite)}</Text>
              <Text style={s.cUnite}>{l.unite ?? ""}</Text>
              <Text style={s.cPu}>{formatEuros(l.prix_unitaire_ht)}</Text>
              <Text style={s.cTva}>{formatNombre(l.taux_tva)} %</Text>
              <Text style={s.cTotal}>
                {formatEuros(Math.round(Number(l.quantite) * Number(l.prix_unitaire_ht) * 100) / 100)}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.totaux} wrap={false}>
          <View style={s.totalLigne}>
            <Text>Total HT</Text>
            <Text>{formatEuros(facture.total_ht)}</Text>
          </View>
          {[...parTaux.entries()]
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
            <Text>{facture.type === "avoir" ? "Total avoir TTC" : "Net à payer TTC"}</Text>
            <Text>{formatEuros(facture.total_ttc)}</Text>
          </View>
        </View>

        <View style={s.mentions} wrap={false}>
          {facture.mention_tva && <Text style={base.gras}>{facture.mention_tva}</Text>}
          {e.tva_sur_debits && <Text style={base.gras}>Option pour le paiement de la taxe d&apos;après les débits.</Text>}
          {facture.type === "facture" && (
            <View style={s.cadre}>
              <Text>{e.conditions_paiement}</Text>
              {e.iban && (
                <Text>
                  IBAN : {e.iban}
                  {e.bic ? `   BIC : ${e.bic}` : ""}
                </Text>
              )}
              <Text style={[base.petit, { marginTop: 4 }]}>{e.penalites_retard}</Text>
            </View>
          )}
          {e.assureur_decennale && (
            <Text style={base.petit}>
              Assurance responsabilité civile décennale : {e.assureur_decennale}, contrat n° {e.police_decennale}
              {e.zone_couverture ? `, couverture géographique : ${e.zone_couverture}` : ""}.
            </Text>
          )}
          {e.mentions_libres && <Text style={base.petit}>{e.mentions_libres}</Text>}
        </View>

        <Text style={base.pied} fixed>
          {`${e.raison_sociale ?? ""} · ${adresseComplete(e)}${e.siret ? ` · SIRET ${e.siret}` : ""}   —   ${libelle} ${
            facture.numero ?? "brouillon"
          }`}
        </Text>
      </Page>
    </Document>
  );
}
