import { createBrainReport } from "./brainReportEngine";
import { createExecutionRequest } from "./brainActionEngine";

export async function dailyBrainCycle() {
  await createBrainReport({
    module: "Brain",
    category: "daily-cycle",
    title: "Cycle Brain Quotidien",
    content:
      "Analyse automatique exécutée par NOVARA Brain.",
  });

  await createExecutionRequest({
    title: "Vérification Brain",
    description:
      "Contrôle automatique du système Brain.",
    source_module: "Brain",
    target_system: "Brain",
    risk_level: "LOW",
  });

  return true;
}
