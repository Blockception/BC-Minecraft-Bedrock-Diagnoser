import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticSeverity } from "../../../main";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Types } from "bc-minecraft-bedrock-types";

export function minecraft_effect_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  //Check if minecraft has effect data
  if (MinecraftData.General.Effects.includes(value.text)) return;

  diagnoser.Add(value, "Effect does not exist: " + value.text, DiagnosticSeverity.error, "minecraft.effect.invalid");
}
