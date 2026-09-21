export type StatutChantier = "prevu" | "en_cours" | "termine" | "annule";
export type PhasePhoto = "avant" | "pendant" | "apres";
export type StatutFacture = "brouillon" | "emise" | "payee";

export type Client = {
  id: string;
  type: "particulier" | "professionnel";
  nom: string;
  societe: string | null;
  siret: string | null;
  tva_intracom: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  notes: string | null;
  created_at: string;
};

export type Chantier = {
  id: string;
  client_id: string | null;
  titre: string;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  statut: StatutChantier;
  date_debut: string | null;
  date_fin: string | null;
  description: string | null;
  recap_travaux: string | null;
  created_at: string;
  updated_at: string;
};

export type Commentaire = {
  id: string;
  chantier_id: string;
  contenu: string;
  created_at: string;
};

export type Photo = {
  id: string;
  chantier_id: string;
  storage_path: string;
  phase: PhasePhoto;
  legende: string | null;
  dans_pack: boolean;
  created_at: string;
};

export type Entreprise = {
  owner_id: string;
  raison_sociale: string;
  forme_juridique: string | null;
  capital: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  telephone: string | null;
  email: string | null;
  site_web: string | null;
  siret: string | null;
  rcs: string | null;
  tva_intracom: string | null;
  franchise_tva: boolean;
  assureur_decennale: string | null;
  police_decennale: string | null;
  zone_couverture: string | null;
  iban: string | null;
  bic: string | null;
  delai_paiement_jours: number;
  conditions_paiement: string;
  penalites_retard: string;
  prefixe_facture: string;
  mentions_libres: string | null;
};

export type Facture = {
  id: string;
  type: "facture" | "avoir";
  facture_origine_id: string | null;
  client_id: string;
  chantier_id: string | null;
  statut: StatutFacture;
  numero: string | null;
  date_emission: string | null;
  date_echeance: string | null;
  date_paiement: string | null;
  mode_paiement: string | null;
  objet: string | null;
  periode_travaux: string | null;
  mention_tva: string | null;
  notes_internes: string | null;
  total_ht: string;
  total_tva: string;
  total_ttc: string;
  emetteur: Partial<Entreprise> | null;
  destinataire: Partial<Client> | null;
  created_at: string;
};

export type LigneFacture = {
  id: string;
  facture_id: string;
  position: number;
  designation: string;
  quantite: string;
  unite: string | null;
  prix_unitaire_ht: string;
  taux_tva: string;
};

export type DemandeContact = {
  id: string;
  nom: string;
  telephone: string | null;
  email: string | null;
  type_projet: string | null;
  message: string | null;
  traitee: boolean;
  created_at: string;
};

/** Résultat renvoyé par les actions de formulaire. */
export type EtatAction = { erreur?: string; ok?: string } | undefined;
