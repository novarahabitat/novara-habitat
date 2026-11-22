// Chantiers réalisés affichés sur la page d'accueil.
// Les photos sont dans public/images/realisations/.

export type Comparaison = {
  titre: string;
  texte: string;
  avant: string;
  apres: string;
  etiquetteAvant: string;
  etiquetteApres: string;
};

export type Realisation = {
  titre: string;
  categorie: string;
  texte: string;
  enCours?: boolean;
  photos: { fichier: string; legende: string }[];
};

export const DOSSIER_REALISATIONS = "/images/realisations/";

export const comparaisons: Comparaison[] = [
  {
    "titre": "Baignoire remplacée par une douche à l'italienne",
    "texte": "Nouveau receveur, nouvelle paroi vitrée, nouveau carrelage et étanchéité complète sous le carrelage.",
    "avant": "sdb-italienne-avant.jpg",
    "apres": "sdb-italienne-apres.jpg",
    "etiquetteAvant": "Avant",
    "etiquetteApres": "Après"
  },
  {
    "titre": "Cheminée : du rendu à la réalité",
    "texte": "Le client a validé une image de la future cheminée avant le début des travaux. La cheminée a ensuite été entièrement refaite, fidèle à l'image.",
    "avant": "cheminee-rendu-3d.jpg",
    "apres": "cheminee-realisee.jpg",
    "etiquetteAvant": "Image projet",
    "etiquetteApres": "Réalisé"
  },
  {
    "titre": "Nouvelle cuisine ouverte",
    "texte": "Dépose de l'ancienne cuisine, reprise de l'électricité et de la plomberie, pose des nouveaux meubles.",
    "avant": "cuisine-ouverte-avant.jpg",
    "apres": "cuisine-ouverte-apres.jpg",
    "etiquetteAvant": "Avant",
    "etiquetteApres": "Après"
  }
];

export const realisations: Realisation[] = [
  {
    "titre": "Cuisine en chêne relookée",
    "categorie": "Cuisine",
    "texte": "Une cuisine ancienne transformée sans tout remplacer : les meubles en chêne sont conservés et remis au goût du jour, avec un nouveau plan de travail, un nouvel évier et une nouvelle plaque de cuisson.",
    "photos": [
      {
        "fichier": "cuisine-chene-apres-1.jpg",
        "legende": "Cuisine refaite"
      },
      {
        "fichier": "cuisine-chene-avant.jpg",
        "legende": "Avant les travaux"
      },
      {
        "fichier": "cuisine-chene-avant-detail.jpg",
        "legende": "Avant les travaux"
      },
      {
        "fichier": "cuisine-chene-travaux.jpg",
        "legende": "Pendant les travaux"
      },
      {
        "fichier": "cuisine-chene-apres-2.jpg",
        "legende": "Cuisine refaite"
      },
      {
        "fichier": "cuisine-chene-apres-3.jpg",
        "legende": "Cuisine refaite"
      },
      {
        "fichier": "cuisine-chene-apres-4.jpg",
        "legende": "Cuisine refaite"
      }
    ]
  },
  {
    "titre": "Salle de bain avec WC suspendu",
    "categorie": "Salle de bain",
    "texte": "Retrait de l'ancien jacuzzi, murs et sol repris, spots encastrés, nouvelle porte. Les toilettes ont été déplacées : WC suspendu et étagère encastrée posés dans le vide mural.",
    "photos": [
      {
        "fichier": "sdb-suspendue-1.jpg",
        "legende": "Salle de bain refaite"
      },
      {
        "fichier": "sdb-suspendue-2.jpg",
        "legende": "Meuble vasque et sèche-serviettes"
      }
    ]
  },
  {
    "titre": "Salle de bain bleue sur mesure",
    "categorie": "Salle de bain",
    "texte": "Une salle de bain reprise depuis la démolition : douche, WC, et meuble vasque construit sur mesure.",
    "photos": [
      {
        "fichier": "sdb-bleue-meuble-sur-mesure.jpg",
        "legende": "Meuble vasque sur mesure"
      },
      {
        "fichier": "sdb-bleue-avant.jpg",
        "legende": "Avant les travaux"
      },
      {
        "fichier": "sdb-bleue-douche-wc.jpg",
        "legende": "Douche et WC"
      },
      {
        "fichier": "sdb-bleue-vasque.jpg",
        "legende": "Vasque posée"
      }
    ]
  },
  {
    "titre": "Ancien placard à balais devenu étagère",
    "categorie": "Aménagement",
    "texte": "Le mur arrière du placard a été ouvert et l'espace réaménagé en étagère centrale éclairée.",
    "photos": [
      {
        "fichier": "etagere-ancien-placard.jpg",
        "legende": "Nouvelle étagère centrale"
      }
    ]
  },
  {
    "titre": "Appartement : cuisine et meuble vasque",
    "categorie": "Appartement",
    "texte": "Nouvelle cuisine et nouveau meuble vasque pour un appartement.",
    "photos": [
      {
        "fichier": "appartement-cuisine.jpg",
        "legende": "Nouvelle cuisine"
      },
      {
        "fichier": "appartement-meuble-vasque.jpg",
        "legende": "Nouveau meuble vasque"
      }
    ]
  },
  {
    "titre": "Nouvelle cuisine en cours",
    "categorie": "Cuisine",
    "enCours": true,
    "texte": "Assemblage de la nouvelle cuisine, pose de la hotte, reprise de l'électricité et de la plomberie.",
    "photos": [
      {
        "fichier": "cuisine-noire-assemblage.jpg",
        "legende": "Assemblage des meubles"
      },
      {
        "fichier": "cuisine-noire-hotte.jpg",
        "legende": "Hotte posée et raccordée"
      }
    ]
  },
  {
    "titre": "Chambre d'enfant, mur trois couleurs",
    "categorie": "Peinture & décoration",
    "texte": "Peinture décorative d'une chambre d'enfant : le client voulait un mur en trois couleurs.",
    "photos": [
      {
        "fichier": "chambre-enfant-mur-trois-couleurs.jpg",
        "legende": "Chambre d'enfant"
      }
    ]
  }
];
