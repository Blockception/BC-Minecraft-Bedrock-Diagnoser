import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";

export function general_keyword_diagnose(keyword: string, value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  //Keyword matches the given value, then stop
  if (value.text === keyword) return;

  diagnoser.Add(value, `Invalid keyword: ${value}, expected keyword: ${value}`, DiagnosticSeverity.error, "keyword.invalid");
}
