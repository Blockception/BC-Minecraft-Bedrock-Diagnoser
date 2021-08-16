import { Command } from "bc-minecraft-bedrock-command";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { OffsetWord } from "../../../Types/OffsetWord";
import { check_definition_value, education_enabled } from "../../Definitions";

/**Checks if the entities exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_entityid_diagnose(id: OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();

  //Project has entity
  if (data.hasEntity(id.text)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has entity
  if (MinecraftData.BehaviorPack.hasEntity(id.text, edu)) return;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.entity, id.text, diagnoser)) return;

  //Nothing then report error
  diagnoser.Add(id.offset, `Cannot find entity definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.entity.missing");
}

/**Checks if the event is defined on the correct entities
 * @param data
 * @param builder
 * @param Com
 */
export function behaviorpack_entity_event_diagnose(data: OffsetWord, diagnoser: DiagnosticsBuilder, Com: Command): void {
  throw new Error("Function not implemented.");
}
