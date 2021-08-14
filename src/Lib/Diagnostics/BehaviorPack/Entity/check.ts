import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { Definition } from "bc-minecraft-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { check_definition_value, education_enabled } from "../../Definitions";

/**Checks if the entities exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_check_entityid(id: string, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();

  //Project has entity
  if (data.hasEntity(id)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has entity
  if (MinecraftData.BehaviorPack.hasEntity(id, edu)) return;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.entity, id, diagnoser)) return;

  //Nothing then report error
  diagnoser.Add(id, `Cannot find entity definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.entity.missing");
}
