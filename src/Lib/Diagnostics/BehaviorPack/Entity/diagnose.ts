import { Command, ParameterType } from "bc-minecraft-bedrock-command";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value, education_enabled } from "../../Definitions";

/**Checks if the entities exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_entityid_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  let id = value.text;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.entity, id, diagnoser)) return;

  const data = diagnoser.context.getCache();

  //Project has entity
  if (data.hasEntity(id)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has entity
  if (MinecraftData.BehaviorPack.hasEntity(id, edu)) return;

  //No namespace?
  if (!id.includes(':')) {
    id = "minecraft:" + id;

    //Defined in McProject
    if (check_definition_value(diagnoser.project.definitions.entity, id, diagnoser)) return;

    const data = diagnoser.context.getCache();

    //Project has entity
    if (data.hasEntity(id)) return;

    const edu = education_enabled(diagnoser);

    //Vanilla has entity
    if (MinecraftData.BehaviorPack.hasEntity(id, edu)) return;
  }

  //Nothing then report error
  diagnoser.Add(value.offset, `Cannot find entity definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.entity.missing");
}

/**Checks if the entities exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_entity_spawnegg_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const id = value.text.replace('_spawn_egg', "");

  behaviorpack_entityid_diagnose({ offset: value.offset, text: id }, diagnoser);
}

/**Checks if the event is defined on the correct entities
 * @param data
 * @param builder
 * @param Com
 */
export function behaviorpack_entity_event_diagnose(data: Types.OffsetWord, diagnoser: DiagnosticsBuilder, Com: Command): void {
  const edu = education_enabled(diagnoser);
  const matches = Com.getBestMatch(edu);

  if (matches.length !== 1) return;

  const entityid_index = matches[0].parameters.findIndex(p => { p.type === ParameterType.entity });
  let entityid: string | undefined = undefined;

  if (entityid_index >= 0) {
    entityid = Com.parameters[entityid_index]?.text;
  }
  else {
    //TODO selector parsing?
  }

  if (entityid) {
    //Get entity
    const entity = diagnoser.context.getCache().BehaviorPacks.entities.get(entityid);

    //Entity found
    if (entity) {
      //Events not found
      if (!entity.events.includes(data.text)) {
        diagnoser.Add(data.offset, `Entity: ${entityid} has no event declared: ${data.text}`, DiagnosticSeverity.error, "behaviorpack.entity.event.missing");
      }
    }
  }
}
