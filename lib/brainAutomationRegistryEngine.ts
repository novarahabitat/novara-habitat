export function getAutomationRegistry() {
  return [
    {
      name: "Daily Brain Cycle",
      trigger: "DAILY",
      target: "Reports + Execution",
      status: "PLANNED",
    },
    {
      name: "Health Monitoring",
      trigger: "HOURLY",
      target: "Health",
      status: "PLANNED",
    },
    {
      name: "Execution Validation",
      trigger: "ON_APPROVAL",
      target: "Execution",
      status: "PLANNED",
    },
    {
      name: "Module Sync",
      trigger: "EVENT",
      target: "Registry",
      status: "PLANNED",
    },
    {
      name: "Decision Impact Analysis",
      trigger: "DECISION_CREATED",
      target: "Impact Engine",
      status: "PLANNED",
    },
  ];
}
