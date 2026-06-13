export function getWorkerRegistry() {
  return [
    {
      name: "Brain Daily Cycle Worker",
      status: "PLANNED",
      frequency: "DAILY",
      purpose: "Lancer automatiquement le cycle Brain quotidien",
    },
    {
      name: "Brain Health Worker",
      status: "PLANNED",
      frequency: "HOURLY",
      purpose: "Surveiller la santé du Brain",
    },
    {
      name: "Brain Sync Worker",
      status: "PLANNED",
      frequency: "EVENT_BASED",
      purpose: "Synchroniser les modules NOVARA avec Brain",
    },
    {
      name: "Brain Execution Worker",
      status: "PLANNED",
      frequency: "ON_APPROVAL",
      purpose: "Exécuter les actions validées",
    },
  ];
}
