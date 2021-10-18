import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { Types } from "bc-minecraft-bedrock-types";

export function general_float_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  if (General.Float.is(value.text)) return true;

  diagnoser.Add(value, "Invalid float value: " + value.text, DiagnosticSeverity.error, "float.invalid");
  return false;
}

export function general_positive_float_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  //If its not a float then skip positive check
  if (!general_float_diagnose(value, diagnoser)) return false;

  const n = Number.parseInt(value.text);

  if (n >= 0) return true;

  diagnoser.Add(value, `expected a positive float but got: ${n}`, DiagnosticSeverity.error, "float.positive.only");
  return false;
}
