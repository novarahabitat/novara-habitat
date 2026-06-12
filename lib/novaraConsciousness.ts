export type ConsciousnessQuestion = {
  sourceModule: string;
  eventType: string;
  title: string;
};

export function evaluateImpact(
  question: ConsciousnessQuestion
) {
  const impacts: string[] = [];

  const module = question.sourceModule.toLowerCase();

  if (module === "rh") {
    impacts.push("Payroll");
    impacts.push("Core");
    impacts.push("Permissions");
  }

  if (module === "core") {
    impacts.push("RH");
    impacts.push("Property");
    impacts.push("SAV");
  }

  if (module === "property") {
    impacts.push("Core");
    impacts.push("Concierge");
    impacts.push("Smart");
  }

  return impacts;
}
