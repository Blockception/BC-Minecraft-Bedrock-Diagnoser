import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";

export function diagnose_events(any: any | undefined, events: string[], Builder: DiagnosticsBuilder) {
  if (typeof any !== "object") return;

  for (const prop in any) {
    //Found an event property
    const value = any[prop];
    if (prop === "event") {
      const target = any["target"];

      if ((target === "self" || target === undefined) && typeof value === "string") {
        if (!events.includes(value)) {
          Builder.Add(value, "Couldn't find event: " + value, DiagnosticSeverity.error, "event.missing");
        }
      }
    }

    if (typeof value === "object") {
      diagnose_events(value, events, Builder);
    }
  }
}
