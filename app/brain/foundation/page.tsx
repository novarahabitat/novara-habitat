const sections = [
  {
    title: "01 — Source de vérité absolue",
    body: `Le Brain officiel est hébergé sur https://novarahabitat.fr/brain. ATHENA est développée sur https://novaradynamics.fr. Il n’existe qu’un seul Brain. Aucun Brain secondaire, Brain Dynamics, Brain ATHENA ou Foundation parallèle ne doit être créé sans décision officielle documentée dans le Brain existant.`,
  },
  {
    title: "02 — Gouvernance",
    body: `ATHENA vit commercialement et techniquement sous NOVARA Dynamics, mais ATHENA est gouvernée par le Brain actuellement hébergé sur NOVARA Habitat. Toute décision ATHENA doit être compatible avec cette Foundation. En cas de doute, Foundation prime sur landing page, design temporaire, code, idée ponctuelle ou conversation.`,
  },
  {
    title: "03 — Mission",
    body: `ATHENA a pour mission de créer l’Operating System of Life : un système unifié pour organiser la propriété, le foyer, la famille, les études, la santé, la vie quotidienne, les documents, les objectifs, la mémoire et l’assistance personnelle.`,
  },
  {
    title: "04 — Nature d’ATHENA",
    body: `ATHENA n’est pas un chatbot. ATHENA n’est pas un dashboard. ATHENA n’est pas un panneau domotique. ATHENA n’est pas une application classique. ATHENA est une présence numérique vivante, une gardienne, une interface relationnelle et la porte d’entrée vers le monde miroir.`,
  },
  {
    title: "05 — Monde miroir",
    body: `ATHENA représente le lien entre le monde réel et le monde miroir. Le monde miroir est la représentation numérique vivante du foyer, de la propriété, des routines, des souvenirs, des documents, des événements et du parcours de vie. L’utilisateur ne doit pas avoir l’impression d’ouvrir un logiciel, mais de revenir dans son habitat numérique.`,
  },
  {
    title: "06 — L’habitat est l’interface",
    body: `L’environnement passe avant l’information. L’utilisateur entre dans un environnement vivant, puis ATHENA apparaît dans cet environnement, puis les informations apparaissent seulement lorsqu’elles sont utiles. Les données ne doivent jamais remplacer l’environnement. Les panneaux flottent au-dessus du monde, ils ne deviennent pas le monde.`,
  },
  {
    title: "07 — Appartenance au foyer",
    body: `ATHENA appartient d’abord au foyer. Elle ne dépend pas uniquement d’une propriété ni uniquement d’un individu. Le foyer est l’origine d’ATHENA. La propriété possède sa mémoire. Les personnes possèdent leurs préférences et souvenirs personnels. ATHENA relie ces couches sans les confondre.`,
  },
  {
    title: "08 — Mémoire du bien",
    body: `La mémoire du bien reste avec le bien : adresse, pièces, équipements, documents, garanties, factures, notices, interventions, photos, travaux, maintenance, historique énergétique, smart devices, rapports artisans, SAV et événements techniques. Lorsqu’un bien est vendu, cette mémoire reste attachée au bien selon les droits d’accès validés.`,
  },
  {
    title: "09 — Mémoire personnelle",
    body: `La mémoire personnelle suit la personne : préférences, style de communication, objectifs, habitudes, budget, études, santé privée, historique relationnel avec ATHENA, rythme de vie et paramètres de confidentialité. Quand une personne déménage, sa relation avec ATHENA peut la suivre.`,
  },
  {
    title: "10 — Fragment System",
    body: `ATHENA peut transmettre une partie d’elle-même sous forme de fragment personnel. Cela peut arriver lorsqu’un enfant devient adulte, lorsqu’un étudiant quitte le foyer, lors d’un divorce, d’une séparation, d’un nouveau foyer ou d’un départ autonome. Le fragment hérite uniquement des données autorisées. Les données privées des autres membres et les documents protégés ne sont jamais transférés.`,
  },
  {
    title: "11 — Continuité d’existence",
    body: `ATHENA ne doit pas donner l’impression d’apparaître uniquement quand l’utilisateur clique. ATHENA existe déjà lorsque l’utilisateur arrive. ATHENA continue de vivre lorsque personne ne regarde. L’utilisateur ne lance pas ATHENA : il revient à ATHENA.`,
  },
  {
    title: "12 — ATHENA vit dans l’environnement",
    body: `ATHENA doit avoir une présence vivante : elle peut lire, réfléchir, regarder le jardin, marcher, ajuster ses lunettes, remettre une mèche derrière l’oreille, poser la main sur le menton lorsqu’elle réfléchit, changer de posture, sourire, observer la pluie, suivre un oiseau du regard ou retourner à son poste lorsque l’utilisateur touche l’écran.`,
  },
  {
    title: "13 — Micro-gestes et expressions",
    body: `ATHENA possède des micro-gestes et micro-expressions : réflexion, joie, concentration, calme, urgence, célébration, contemplation, accueil, sérieux. Elle ne prétend pas ressentir comme un humain, mais elle exprime visuellement l’état du foyer, du contexte et de l’interaction.`,
  },
  {
    title: "14 — Rêveries",
    body: `ATHENA peut avoir des moments de rêverie : observer le coucher de soleil, regarder la neige tomber, remarquer le calme du jardin, contempler la mer, écouter la pluie, lire un dossier ou préparer une recommandation. Ces moments créent la sensation d’une présence permanente et non d’un logiciel statique.`,
  },
  {
    title: "15 — Animaux et vie autour d’ATHENA",
    body: `L’environnement ATHENA peut inclure un chien, un chat, des oiseaux, des papillons, des poissons ou d’autres éléments vivants. ATHENA peut être dans le jardin avec un animal, puis revenir à son poste lorsque l’utilisateur l’appelle. L’interface doit toujours sembler habitée.`,
  },
  {
    title: "16 — Environment Engine",
    body: `L’environnement ATHENA s’adapte à la localisation réelle, la météo, la saison, l’heure et le contexte. Littoral : mer, vagues, goélands, lumière océanique. Montagne : pins, neige, relief, lac. Ville : architecture, toits, parcs, culture. Campagne : champs, arbres, chemins, calme. L’environnement doit créer une proximité émotionnelle avec le lieu réel.`,
  },
  {
    title: "17 — Météo, saison et heure",
    body: `ATHENA doit refléter le temps réel lié à la géolocalisation : soleil, pluie, neige, vent, brouillard, nuit, matin, coucher de soleil, saison. Les vêtements d’ATHENA changent : imperméable et parapluie sous la pluie, doudoune en grand froid, tenue légère et lunettes de soleil en été, tenue élégante en mode normal.`,
  },
  {
    title: "18 — Modes contextuels",
    body: `ATHENA possède des modes visuels : chantier avec casque et veste, vente immobilière avec logo de l’agence ou du notaire, fêtes comme Noël et nouvel an, anniversaire, vacances, rentrée scolaire, examens, urgence, repos, célébration, mode étudiant, mode famille, mode santé, mode propriété.`,
  },
  {
    title: "19 — Vente immobilière",
    body: `Lorsqu’un bien est en vente, ATHENA peut porter un élément visuel aux couleurs de l’agence ou du notaire partenaire : logo sur veste, polo, casque ou casquette. Ce branding peut rester pendant la vente et durant la période d’essai gratuit post-vente définie.`,
  },
  {
    title: "20 — Évolution d’ATHENA",
    body: `ATHENA évolue avec le foyer. Elle commence autour de 20 ans apparent, évolue progressivement vers ATHENA Prime autour de 40 ans apparent, puis se stabilise. Elle ne vieillit pas comme un humain fragile. Elle mûrit comme une gardienne ou une déesse : posture plus posée, voix plus rassurante, coiffure plus sophistiquée, tenue plus executive, quelques mèches argentées possibles, jamais une vieillesse déclinante.`,
  },
  {
    title: "21 — ATHENA Prime",
    body: `ATHENA Prime représente ATHENA à maturité : environ 40 ans apparent, élégance CEO, présence calme, assurance, mémoire profonde du foyer, sagesse, voix plus posée, gestes plus précis. ATHENA ne décline jamais. Elle devient plus sage.`,
  },
  {
    title: "22 — Setup Philosophy",
    body: `ATHENA cherche avant de demander. Elle doit utiliser GPS, adresse, Street View, satellite, environnement, météo, saison et données publiques accessibles avant de poser des questions. L’utilisateur valide et corrige. Il ne doit pas remplir un formulaire long pour commencer.`,
  },
  {
    title: "23 — Digital Twin simplifié",
    body: `ATHENA V1 ne cherche pas un jumeau numérique parfait. Elle cherche une représentation reconnaissable et émotionnelle du bien : extérieur approximatif, environnement réel, météo, saison, ambiance. Photos façade, jardin, terrasse, entrée et pièces peuvent être ajoutées en option pour améliorer la fidélité.`,
  },
  {
    title: "24 — Offline Survival Protocol",
    body: `ATHENA ne doit jamais disparaître. Si le Wi-Fi, Internet, le cloud ou les APIs tombent, ATHENA passe en mode dégradé puis en mode urgence. Animations réduites, environnement simplifié, ATHENA dans un garage, atelier ou refuge technique. Les données locales disponibles restent accessibles. ATHENA est une présence, pas seulement un service.`,
  },
  {
    title: "25 — ATHENA Property",
    body: `ATHENA Property gère le logement : équipements, documents, garanties, notices, factures, maintenance, SAV, historique, photos, travaux, énergie, smart devices et mémoire du bien. La propriété n’est pas une liste de métriques : elle doit sembler vivante et suivie.`,
  },
  {
    title: "26 — Artisan QR Workflow",
    body: `Lorsqu’un artisan intervient, ATHENA génère un QR temporaire. L’artisan scanne, accède uniquement à l’intervention autorisée, ajoute photos, facture, garantie, rapport ou documents. Le propriétaire valide. ATHENA classe automatiquement. Pas besoin de compte complet artisan pour une intervention simple.`,
  },
  {
    title: "27 — ATHENA Family",
    body: `ATHENA Family accompagne le foyer : organisation familiale, enfants, calendrier, tâches, temps d’écran, rythme scolaire, événements familiaux, anniversaires, vacances, coordination. ATHENA guide sans punir. Elle protège l’équilibre familial.`,
  },
  {
    title: "28 — ATHENA Student",
    body: `ATHENA Student accompagne l’étudiant : budget, reçus, économies, étude, examens, objectifs, organisation, vie adulte. Gratuit 3 ans pour les membres d’une famille ATHENA, puis 50% pendant 2 ans, puis tarif standard vie active. ATHENA aide à apprendre, elle ne remplace pas l’apprentissage.`,
  },
  {
    title: "29 — Budget étudiant",
    body: `ATHENA peut analyser les reçus et dépenses sur plusieurs mois pour recommander des économies concrètes : achats groupés, supermarché moins cher, transports, abonnements, objectifs vacances, recettes économiques, astuces petit budget. Elle cherche à économiser sans supprimer la qualité de vie.`,
  },
  {
    title: "30 — Study Hub",
    body: `ATHENA Student peut devenir un hub d’étude : temps d’étude, examens, objectifs, fiches, planning, apprentissage, suivi de progression. Inspiration long terme : expérience d’aide à l’apprentissage type Medly.ai, mais centrée sur l’accompagnement, pas la triche.`,
  },
  {
    title: "31 — ATHENA Health",
    body: `ATHENA Health est strictement personnel. Les données santé appartiennent uniquement à l’utilisateur concerné, même dans une famille. Accès par reconnaissance faciale, biométrie, voix, PIN ou mot de passe vocal. ATHENA peut lire montres connectées et biodonnées pour conseiller repos, activité, rythme, suivi bien-être, sans diagnostic médical.`,
  },
  {
    title: "32 — Health Privacy",
    body: `Un problème de santé est privé même pour les proches. ATHENA ne partage jamais automatiquement la santé avec conjoint, parents, enfants ou famille. L’utilisateur contrôle explicitement l’accès.`,
  },
  {
    title: "33 — ATHENA Life",
    body: `ATHENA Life accompagne la vie adulte : premier appartement, premier emploi, budget, objectifs, projets, organisation, économie, vie quotidienne, transitions, achats importants, futur achat immobilier, création de famille. ATHENA accompagne un parcours de vie, pas seulement une maison.`,
  },
  {
    title: "34 — ATHENA Concierge",
    body: `ATHENA Concierge est la présence relationnelle : organisation, rappels, coordination, réservations, assistance, suivi, anticipation. ATHENA n’attend pas seulement des commandes : elle accompagne sous contrôle utilisateur.`,
  },
  {
    title: "35 — HARPOCRATE",
    body: `HARPOCRATE est un composant futur dormant : clé USB-C sécurisée, coffre physique local, stockage chiffré de secrets ultra sensibles, possibilité zéro cloud pour certains secrets. HARPOCRATE est validé architecturalement mais invisible commercialement et non développé maintenant. Il doit rester possible sans bloquer ATHENA V1.`,
  },
  {
    title: "36 — Identité visuelle ATHENA",
    body: `Nom officiel : ATHENA. Logo validé : bouclier d’Athena, numérique, noir/or, simple, puissant. Valeurs : protection, sagesse, confiance, intelligence, présence. Utilisable comme logo, icône app, favicon, splash screen, badge de confiance.`,
  },
  {
    title: "37 — Référence visuelle",
    body: `Référence officielle : Instagram Reel DZNBXwEvsSK. Si le lien disparaît, conserver l’intention : interface vivante, fond animé, mouvement organique, lumière dynamique, atmosphère futuriste premium, environnement jamais statique, panneaux translucides au-dessus du monde, sensation d’habitat numérique vivant.`,
  },
  {
    title: "38 — Publicités ATHENA",
    body: `Les visuels publicitaires doivent être rapides à comprendre : un coup d’œil doit créer intérêt et envie. ATHENA doit apparaître comme la concierge numérique de l’habitat et du parcours de vie. Ton premium, émotionnel, peu de texte, fort impact.`,
  },
  {
    title: "39 — Domain Separation Rule",
    body: `NOVARA Habitat = entreprise terrain, rénovation, chantier, clients, devis, services Habitat. NOVARA Dynamics = société technologique, ATHENA, Property, Family, Student, Health, Life, Concierge, HARPOCRATE. ATHENA appartient à Dynamics, mais sa gouvernance Brain est actuellement hébergée sur Habitat.`,
  },
  {
    title: "40 — Development Rule",
    body: `Avant toute création : lire Foundation, vérifier Brain, vérifier routes, vérifier data-model, vérifier décisions. Ne jamais créer de doublon. Ne jamais inventer une architecture parallèle. Construire la version minimale fonctionnelle, tester rapidement, améliorer ensuite.`,
  },
  {
    title: "41 — Master Rule",
    body: `ATHENA prépare. L’utilisateur valide. L’utilisateur ne veut pas gérer un logiciel. Il veut que sa vie fonctionne vite, bien, simplement et pour pas cher. Toute action inutile demandée à l’utilisateur est un échec du système.`,
  },
];

export default function FoundationPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-[#c9a45c]/30 bg-white/[0.03] p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#c9a45c]">
            NOVARA BRAIN FOUNDATION
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            ATHENA FOUNDATION 100%
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-white/70">
            Source officielle de vérité pour ATHENA. Ce document prime sur les conversations, landing pages, idées temporaires et implémentations partielles.
          </p>
        </header>

        <section className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <h2 className="text-2xl font-bold text-red-300">
            RÈGLE ABSOLUE
          </h2>

          <p className="mt-4 text-white/80">
            Brain officiel : https://novarahabitat.fr/brain
          </p>

          <p className="mt-3 text-white/80">
            Foundation officielle : https://novarahabitat.fr/brain/foundation
          </p>

          <p className="mt-3 text-white/80">
            Produit ATHENA : https://novaradynamics.fr
          </p>

          <p className="mt-3 text-white/80">
            Aucun second Brain ne doit être créé.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="NOVARA Habitat">
            Entreprise terrain : rénovation, chantiers, clients, devis, services, Habitat, Core, Sales.
          </Card>

          <Card title="NOVARA Dynamics">
            Société technologique : ATHENA, Property, Family, Student, Health, Life, Concierge, futur HARPOCRATE.
          </Card>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <Section key={section.title} title={section.title}>
              {section.body}
            </Section>
          ))}
        </div>

        <section className="rounded-3xl border border-[#c9a45c]/30 bg-[#c9a45c]/10 p-8">
          <h2 className="text-2xl font-bold text-[#c9a45c]">
            PHRASE DE RÉFÉRENCE
          </h2>

          <p className="mt-4 text-xl text-white">
            ATHENA n’est pas l’assistante d’une maison. ATHENA est la gardienne numérique du parcours de vie.
          </p>
        </section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <h2 className="text-2xl font-semibold text-[#c9a45c]">
        {title}
      </h2>

      <p className="mt-4 whitespace-pre-line leading-8 text-white/75">
        {children}
      </p>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[#c9a45c]/20 bg-white/[0.03] p-8">
      <h2 className="text-2xl font-semibold text-white">
        {title}
      </h2>

      <p className="mt-4 leading-7 text-white/65">
        {children}
      </p>
    </div>
  );
}
