import { StyleSheet } from "@react-pdf/renderer";

export const couleurs = {
  foret: "#153126",
  or: "#b99252",
  encre: "#1f1f1f",
  gris: "#5c5a55",
  filet: "#e4ddd0",
  creme: "#f6f1e8",
};

export const base = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: couleurs.encre,
    lineHeight: 1.4,
  },
  gras: { fontFamily: "Helvetica-Bold" },
  petit: { fontSize: 8, color: couleurs.gris },
  surtitre: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: couleurs.or,
  },
  pied: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    fontSize: 7,
    color: couleurs.gris,
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: couleurs.filet,
    paddingTop: 6,
  },
});
