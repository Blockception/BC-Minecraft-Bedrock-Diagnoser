import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { OffsetWord } from "../../Types/OffsetWord";
import { check_definition_value } from "../Definitions";
import { Text } from 'bc-minecraft-bedrock-project';

export function minecraft_tickingarea_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //Project has defined
  if (data.General.tickingAreas.has(id)) return;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tickingarea, id, diagnoser)) return;

  //Nothing then report error
  diagnoser.Add(value.offset, `Cannot find tickingarea definition: ${id}`, DiagnosticSeverity.error, "minecraft.tickingarea.missing");
}
