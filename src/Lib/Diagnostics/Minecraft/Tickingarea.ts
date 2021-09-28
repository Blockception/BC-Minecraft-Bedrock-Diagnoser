import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from "../Definitions";
import { Text } from 'bc-minecraft-bedrock-project';

export function minecraft_tickingarea_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tickingarea, id, diagnoser)) return;

  //Project has defined
  if (data.General.tickingAreas.has(id)) return;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find tickingarea definition: ${id}`, DiagnosticSeverity.error, "minecraft.tickingarea.missing");
}
