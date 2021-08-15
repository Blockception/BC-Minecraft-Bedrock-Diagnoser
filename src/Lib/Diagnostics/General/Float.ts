import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { OffsetWord } from "../../Types/OffsetWord";

export function general_float_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (General.Float.is(value.text)) return;

  diagnoser.Add(value.offset, "Invalid float value: " + value.text, DiagnosticSeverity.error, "float.invalid");
}
