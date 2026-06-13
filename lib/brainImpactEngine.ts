import { evaluateImpact } from "./novaraConsciousness";

export function getImpactedModules(module: string, title: string) {
  return evaluateImpact({
    sourceModule: module,
    eventType: "impact",
    title,
  });
}
