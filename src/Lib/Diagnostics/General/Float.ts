import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { Types } from "bc-minecraft-bedrock-types";

export function general_float_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder, range?: { min: number; max: number }): boolean {
  if (General.Float.is(value.text)) {
    if (range) {
      const v = Number.parseFloat(value.text);

      if (v < range.min)
        diagnoser.Add(value, `The value of ${v} is lower than the allowed minimum: ${range.min}`, DiagnosticSeverity.error, "general.float.minimum");
      if (v > range.max)
        diagnoser.Add(value, `The value of ${v} is higher than the allowed minimum: ${range.max}`, DiagnosticSeverity.error, "general.float.maximum");
    }

    return true;
  }

  diagnoser.Add(value, "Invalid float value: " + value.text, DiagnosticSeverity.error, "general.float.invalid");
  return false;
}

export function general_positive_float_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  //If its not a float then skip positive check
  if (!general_float_diagnose(value, diagnoser)) return false;

  const n = Number.parseInt(value.text);

  if (n >= 0) return true;

  diagnoser.Add(value, `expected a positive float but got: ${n}`, DiagnosticSeverity.error, "general.float.positive.only");
  return false;
}
