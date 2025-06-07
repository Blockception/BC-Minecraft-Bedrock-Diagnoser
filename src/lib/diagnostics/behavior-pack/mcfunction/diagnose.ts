import { Text } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { check_definition_value } from "../../definitions";

export function behaviorpack_functions_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  const data = diagnoser.context.getProjectData().projectData;
  const id = Text.UnQuote(value.text);

  //Check project
  if (check_definition_value(diagnoser.project.definitions.function, id, diagnoser)) return true;

  //If project has function then ignore
  if (data.behaviorPacks.functions.has(id)) return true;

  diagnoser.add(
    value.offset,
    `Cannot find mcfunction: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.mcfunction.missing"
  );
  return false;
}
