import { General } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { OffsetWord } from "../../Types/OffsetWord";

export function general_coordinate_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (General.Coordinate.is(value.text)) return;

  diagnoser.Add(value.offset, "Invalid coordiante value: " + value.text, DiagnosticSeverity.error, "coordinate.invalid");
}
