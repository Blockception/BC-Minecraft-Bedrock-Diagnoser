import { Minecraft } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { OffsetWord } from "../../Types/OffsetWord";

export function minecraft_coordinate_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (Minecraft.Coordinate.is(value.text)) return;

  diagnoser.Add(value.offset, "Invalid coordiante value: " + value.text, DiagnosticSeverity.error, "minecraft.coordinate.invalid");
}
