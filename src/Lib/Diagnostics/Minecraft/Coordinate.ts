import { Minecraft } from "bc-minecraft-bedrock-types";
import { Types } from 'bc-minecraft-bedrock-types'
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

export function minecraft_coordinate_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (Minecraft.Coordinate.is(value.text)) return;

  diagnoser.Add(value, "Invalid coordinate value: " + value.text, DiagnosticSeverity.error, "minecraft.coordinate.invalid");
}
