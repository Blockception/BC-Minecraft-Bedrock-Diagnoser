import { Minecraft } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder";
import { Types } from "bc-minecraft-bedrock-types";

export function minecraft_xp_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (Minecraft.XP.is(value.text)) return;

  diagnoser.Add(value, "Invalid xp value: " + value.text, DiagnosticSeverity.error, "minecraft.xp.invalid");
}
