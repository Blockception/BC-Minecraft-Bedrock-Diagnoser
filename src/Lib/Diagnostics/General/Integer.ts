import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { OffsetWord } from "../../Types/OffsetWord";

export function general_integer_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  if (General.Integer.is(value.text)) return true;

  diagnoser.Add(value.offset, "Invalid integer value: " + value.text, DiagnosticSeverity.error, "integer.invalid");
  return false;
}
