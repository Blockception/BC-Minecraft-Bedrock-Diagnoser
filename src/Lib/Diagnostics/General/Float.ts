import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { Types } from "bc-minecraft-bedrock-types";

export function general_float_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  if (General.Float.is(value.text)) return true;

  diagnoser.Add(value, "Invalid float value: " + value.text, DiagnosticSeverity.error, "float.invalid");
  return false;
}
