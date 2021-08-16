import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../main";
import { OffsetWord } from "../../Types/OffsetWord";
import { check_definition_value } from "../Definitions";

export function minecraft_tickingarea_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();

  //Project has defined
  if (data.General.tickingAreas.has(value.text)) return;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tickingarea, value.text, diagnoser)) return;

  //Nothing then report error
  diagnoser.Add(value.offset, `Cannot find tickingarea definition: ${value.text}`, DiagnosticSeverity.error, "minecraft.tickingarea.missing");
}
