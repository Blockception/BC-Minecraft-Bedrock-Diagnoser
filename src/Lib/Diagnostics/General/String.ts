import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticSeverity } from "../../../main";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { OffsetWord } from "../../Types/OffsetWord";

export function general_string_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder) {
  if (General.String.is(value.text)) return;

  diagnoser.Add(value.offset, `Invalid minecraft string: '${value.text}'`, DiagnosticSeverity.error, "string.invalid");
}
