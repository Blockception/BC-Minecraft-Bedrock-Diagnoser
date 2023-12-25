import { Minecraft } from "bc-minecraft-bedrock-types";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";

export function minecraft_coordinate_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  if (Minecraft.Coordinate.is(value.text)) return true;

  diagnoser.add(
    value,
    "Invalid coordinate value: " + value.text,
    DiagnosticSeverity.error,
    "minecraft.coordinate.invalid"
  );
  return false;
}
