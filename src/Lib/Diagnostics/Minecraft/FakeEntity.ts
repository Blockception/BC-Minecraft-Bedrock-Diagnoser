import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { OffsetWord } from "../../Types/OffsetWord";
import { Text } from 'bc-minecraft-bedrock-project';

export function minecraft_fakentity_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //Project has defined
  if (data.General.fakeEntities.has(id)) return;

  //Nothing then report error
  diagnoser.Add(value.offset, `Cannot find fake entity definition: ${id}`, DiagnosticSeverity.error, "minecraft.fakeentity.missing");
}
