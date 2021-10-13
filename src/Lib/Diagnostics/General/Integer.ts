import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { Types } from "bc-minecraft-bedrock-types";

export function general_integer_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  if (General.Integer.is(value.text)) return true;

  diagnoser.Add(value, "Invalid integer value: " + value.text, DiagnosticSeverity.error, "integer.invalid");
  return false;
}

export function general_positive_integer_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  //If its not a integer then skip positive check
  if (!general_integer_diagnose(value, diagnoser)) return false;

  const n = Number.parseInt(value.text);

  if (n >= 0) return true;

  diagnoser.Add(value, `expected a positive integer but got: ${n}`, DiagnosticSeverity.error, "integer.positive.only");
  return false;
}
