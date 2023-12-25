import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { Types } from "bc-minecraft-bedrock-types";

export function general_boolean_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (General.Boolean.is(value.text)) return;

  diagnoser.add(value, "Invalid boolean value: " + value.text, DiagnosticSeverity.error, "general.boolean.invalid");
}
