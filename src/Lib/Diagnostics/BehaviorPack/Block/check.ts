import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { Definition } from "bc-minecraft-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { check_definition_value, education_enabled } from "../../Definitions";

/**Checks if the blocks exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_check_blockid(id: string, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();

  //Project has block
  if (data.hasBlock(id)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has block
  if (MinecraftData.BehaviorPack.hasEntity(id, edu)) return;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.block, id, diagnoser)) return;

  //Nothing then report error
  diagnoser.Add(id, `Cannot find block definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.block.missing");
}
