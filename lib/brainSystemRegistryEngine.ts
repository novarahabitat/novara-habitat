export function getSystemRegistry() {
  return [
    {
      name: "Supabase",
      type: "Database",
      status: "CONNECTED",
      purpose: "Données, tables, mémoire Brain",
    },
    {
      name: "GitHub",
      type: "Code Repository",
      status: "PLANNED",
      purpose: "Code source NOVARA",
    },
    {
      name: "Vercel",
      type: "Deployment",
      status: "CONNECTED",
      purpose: "Déploiement web NOVARA",
    },
    {
      name: "OpenAI",
      type: "AI Engine",
      status: "PLANNED",
      purpose: "Raisonnement, génération, analyse",
    },
    {
      name: "OVHcloud",
      type: "Domains",
      status: "CONNECTED",
      purpose: "Domaines NOVARA",
    },
  ];
}
