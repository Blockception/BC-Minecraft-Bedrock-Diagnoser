import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { OffsetWord } from "../../Types/OffsetWord";

export function general_keyword_diagnose(keyword: string, value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  //Keyword matches the given value, then stop
  if (value.text === keyword) return;

  diagnoser.Add(value.offset, `Invalid keyword: ${value}, expected keyword: ${value}`, DiagnosticSeverity.error, "keyword.invalid");
}
