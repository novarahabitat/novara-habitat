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
    impacts.push("Planning");
    impacts.push("Compliance");
  }

  if (module === "payroll") {
    impacts.push("RH");
    impacts.push("Core");
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

  if (module === "sav") {
    impacts.push("Core");
    impacts.push("Property");
    impacts.push("Concierge");
  }

  if (module === "concierge") {
    impacts.push("Property");
    impacts.push("Smart");
    impacts.push("SAV");
  }

  if (module === "smart") {
    impacts.push("Property");
    impacts.push("Voltis");
    impacts.push("Concierge");
  }

  if (module === "voltis") {
    impacts.push("Smart");
    impacts.push("Property");
    impacts.push("SAV");
  }

  if (module === "sales") {
    impacts.push("Core");
    impacts.push("Property");
    impacts.push("Concierge");
  }

  return impacts;
}
