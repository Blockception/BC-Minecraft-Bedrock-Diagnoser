import { Minecraft } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../main";
import { OffsetWord } from "../../Types/OffsetWord";

export function minecraft_xp_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (Minecraft.XP.is(value.text)) return;

  diagnoser.Add(value.offset, "Invalid xp value: " + value.text, DiagnosticSeverity.error, "minecraft.xp.invalid");
}
