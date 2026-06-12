export type ConsciousnessQuestion = {
  sourceModule: string;
  eventType: string;
  title: string;
};

export function evaluateImpact(
  question: ConsciousnessQuestion
) {
  const impacts: string[] = [];

  if (question.sourceModule === "RH") {
    impacts.push("Payroll");
    impacts.push("Core");
    impacts.push("Permissions");
  }

  if (question.sourceModule === "Core") {
    impacts.push("RH");
    impacts.push("Property");
    impacts.push("SAV");
  }

  if (question.sourceModule === "Property") {
    impacts.push("Core");
    impacts.push("Concierge");
    impacts.push("Smart");
  }

  return impacts;
}
