import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Chantier, Client, Entreprise, PhasePhoto } from "@/lib/types";
import { adresseComplete, formatDate } from "@/lib/format";
import { LOGO_PDF } from "./logo";
import { base, couleurs } from "./styles";

export type PhotoPack = { phase: PhasePhoto; legende: string | null; data: Buffer };

const s = StyleSheet.create({
  couverture: {
    padding: 56,
    fontFamily: "Helvetica",
    color: couleurs.encre,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  logo: { width: 190, alignSelf: "center", marginTop: 40 },
  titreCouverture: {
    fontSize: 30,
    textAlign: "center",
    color: couleurs.foret,
    marginTop: 14,
    lineHeight: 1.2,
  },
  filet: { width: 60, height: 1.5, backgroundColor: couleurs.or, alignSelf: "center", marginVertical: 22 },
  infos: { textAlign: "center", fontSize: 11, lineHeight: 1.6, color: couleurs.gris },
  titreSection: { fontSize: 18, lineHeight: 1.3, color: couleurs.foret, marginBottom: 6 },
  filetSection: { width: 40, height: 1.2, backgroundColor: couleurs.or, marginBottom: 16 },
  recap: { fontSize: 10.5, lineHeight: 1.6 },
  puce: { flexDirection: "row", marginBottom: 5 },
  point: { width: 12, color: couleurs.or },
  grille: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cellule: { width: "48.5%", marginBottom: 14 },
  photo: { width: "100%", height: 200, objectFit: "cover", borderRadius: 3 },
  legende: { fontSize: 8, color: couleurs.gris, marginTop: 4 },
  merci: { marginTop: 40, padding: 18, backgroundColor: couleurs.creme, borderRadius: 4 },
});

const titres: Record<PhasePhoto, string> = {
  avant: "Avant les travaux",
  pendant: "Pendant le chantier",
  apres: "Après les travaux",
};

function Pied({ e }: { e: Partial<Entreprise> }) {
  return (
    <Text style={base.pied} fixed>
      {[e.raison_sociale || "NOVARA Habitat", e.telephone, e.email].filter(Boolean).join(" · ")}
    </Text>
  );
}

export function PackPdf({
  chantier,
  client,
  entreprise: e,
  photos,
}: {
  chantier: Chantier;
  client: Client | null;
  entreprise: Partial<Entreprise>;
  photos: PhotoPack[];
}) {
  const lignesRecap = (chantier.recap_travaux ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
  const phases = (["avant", "pendant", "apres"] as const).filter((p) => photos.some((x) => x.phase === p));
  const periode =
    chantier.date_debut && chantier.date_fin
      ? `Du ${formatDate(chantier.date_debut)} au ${formatDate(chantier.date_fin)}`
      : chantier.date_fin
        ? `Terminé le ${formatDate(chantier.date_fin)}`
        : "";

  return (
    <Document title={`Fin de chantier — ${chantier.titre}`} author={e.raison_sociale || "NOVARA Habitat"}>
      <Page size="A4" style={s.couverture}>
        <View>
          <Image src={LOGO_PDF} style={s.logo} />
          <View style={s.filet} />
          <Text style={[base.surtitre, { textAlign: "center" }]}>Dossier de fin de chantier</Text>
          <Text style={s.titreCouverture}>{chantier.titre}</Text>
        </View>
        <View style={s.infos}>
          {client && <Text>{client.societe ? `${client.nom} — ${client.societe}` : client.nom}</Text>}
          <Text>{adresseComplete(chantier)}</Text>
          {periode && <Text>{periode}</Text>}
        </View>
        <Text style={[base.petit, { textAlign: "center" }]}>
          {[e.raison_sociale || "NOVARA Habitat", e.telephone, e.email].filter(Boolean).join(" · ")}
        </Text>
      </Page>

      <Page size="A4" style={base.page}>
        <Text style={s.titreSection}>Les travaux réalisés</Text>
        <View style={s.filetSection} />
        {lignesRecap.length > 1 ? (
          lignesRecap.map((l, i) => (
            <View key={i} style={s.puce} wrap={false}>
              <Text style={s.point}>•</Text>
              <Text style={[s.recap, { flex: 1 }]}>{l}</Text>
            </View>
          ))
        ) : (
          <Text style={s.recap}>{chantier.recap_travaux}</Text>
        )}

        <View style={s.merci} wrap={false}>
          <Text style={[s.recap, { color: couleurs.foret }]}>
            Merci de votre confiance. Pour toute question sur les travaux réalisés, nous restons à votre disposition.
          </Text>
          {(e.telephone || e.email) && (
            <Text style={[base.petit, { marginTop: 6 }]}>{[e.telephone, e.email].filter(Boolean).join(" · ")}</Text>
          )}
        </View>
        <Pied e={e} />
      </Page>

      {phases.map((phase) => (
        <Page key={phase} size="A4" style={base.page}>
          <Text style={s.titreSection}>{titres[phase]}</Text>
          <View style={s.filetSection} />
          <View style={s.grille}>
            {photos
              .filter((p) => p.phase === phase)
              .map((p, i) => (
                <View key={i} style={s.cellule} wrap={false}>
                  <Image src={{ data: p.data, format: "jpg" }} style={s.photo} />
                  {p.legende && <Text style={s.legende}>{p.legende}</Text>}
                </View>
              ))}
          </View>
          <Pied e={e} />
        </Page>
      ))}
    </Document>
  );
}
