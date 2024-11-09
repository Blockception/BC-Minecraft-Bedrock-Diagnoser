import { Command, ParameterType } from "bc-minecraft-bedrock-command";
import { Types } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types";
import { check_definition_value, education_enabled } from "../../Definitions";

/**
 * Checks if the entities exists in the project or in vanilla, if not then a bug is reported
 * @param value The entity to check
 * @param diagnoser The diagnoser
 * @returns True if the entity exists
 */
export function behaviorpack_entityid_diagnose(
  value: Types.OffsetWord | string,
  diagnoser: DiagnosticsBuilder
): boolean {
  let id = typeof value === "string" ? value : value.text;
  id = id.split("<")[0];
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.entity, id, diagnoser)) {
    return true;
  }

  //Project has entity
  const data = diagnoser.context.getCache();
  if (data.hasEntity(id)) {
    return true;
  }

  //Vanilla has entity
  const edu = education_enabled(diagnoser);
  if (MinecraftData.BehaviorPack.hasEntity(id, edu)) {
    return true;
  }

  //No namespace?
  if (!id.includes(":")) {
    id = "minecraft:" + id;

    //Defined in McProject
    if (check_definition_value(diagnoser.project.definitions.entity, id, diagnoser)) {
      return true;
    }

    //Project has entity
    const data = diagnoser.context.getCache();
    if (data.hasEntity(id)) {
      return true;
    }
  }

  //Vanilla has entity
  if (MinecraftData.BehaviorPack.hasEntity(id, edu)) {
    return true;
  }

  //Nothing then report error
  diagnoser.add(value, `Cannot find entity definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.entity.missing");
  return false;
}

/**Checks if the entities exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_entity_spawnegg_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const id = value.text.replace("_spawn_egg", "");

  behaviorpack_entityid_diagnose({ offset: value.offset, text: id }, diagnoser);
}

/**Checks if the event is defined on the correct entities
 * @param data
 * @param builder
 * @param Com
 */
export function behaviorpack_entity_event_diagnose(
  data: Types.OffsetWord,
  diagnoser: DiagnosticsBuilder,
  Com: Command
): void {
  const edu = education_enabled(diagnoser);
  const matches = Com.getBestMatch(edu);

  if (matches.length !== 1) return;

  const entityid_index = matches[0].parameters.findIndex((p) => p.type === ParameterType.entity);
  let entityid: string | undefined = undefined;

  if (entityid_index >= 0) {
    entityid = Com.parameters[entityid_index]?.text;
  } else {
    //TODO selector parsing?
  }

  if (entityid) {
    //Get entity
    const entity = diagnoser.context.getCache().behaviorPacks.entities.get(entityid);

    //Entity found
    if (entity) {
      //Events not found
      if (!entity.events.includes(data.text)) {
        diagnoser.add(
          data.offset,
          `Entity: ${entityid} has no event declared: ${data.text}`,
          DiagnosticSeverity.error,
          "behaviorpack.entity.event.missing"
        );
      }
    }
  }
}
