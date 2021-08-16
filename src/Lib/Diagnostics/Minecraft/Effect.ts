import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticSeverity } from "../../../main";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { OffsetWord } from "../../Types/OffsetWord";

export function general_effect_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  //Check if minecraft has effect data
  if (MinecraftData.General.Effects.includes(value.text)) return;

  diagnoser.Add(value.offset, "Effect does not exist: " + value.text, DiagnosticSeverity.error, "effect.invalid");
}
