import { Text } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../types";
import { check_definition_value } from "../definitions";

export function minecraft_tickingarea_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tickingarea, id, diagnoser)) return;

  //Project has defined
  if (data.general.tickingAreas.has(id)) return;

  //Nothing then report error
  diagnoser.add(
    value,
    `Cannot find tickingarea definition: ${id}`,
    DiagnosticSeverity.error,
    "minecraft.tickingarea.missing"
  );
}
