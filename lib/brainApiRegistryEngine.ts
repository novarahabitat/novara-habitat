export function getApiRegistry() {
  return [
    {
      name: "Supabase API",
      status: "CONNECTED",
      permission: "READ_WRITE",
      purpose: "Lecture et écriture des données NOVARA",
    },
    {
      name: "GitHub API",
      status: "PLANNED",
      permission: "NOT_CONNECTED",
      purpose: "Lecture, modification du code, pull requests",
    },
    {
      name: "Vercel API",
      status: "PLANNED",
      permission: "NOT_CONNECTED",
      purpose: "Déploiements, domaines, logs",
    },
    {
      name: "OpenAI API",
      status: "PLANNED",
      permission: "NOT_CONNECTED",
      purpose: "Analyse, génération, agents NOVARA",
    },
  ];
}
