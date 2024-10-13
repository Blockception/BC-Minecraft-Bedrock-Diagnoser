import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types";
import { General } from "bc-minecraft-bedrock-types";
import { Types } from "bc-minecraft-bedrock-types";

export function general_string_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder) {
  if (General.String.is(value.text)) return;

  diagnoser.add(value, `Invalid minecraft string: '${value.text}'`, DiagnosticSeverity.error, "general.string.invalid");
}
