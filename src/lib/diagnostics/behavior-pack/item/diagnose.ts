import { behaviorpack_entityid_diagnose } from "../entity";
import { check_definition_value, education_enabled } from "../../definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { Types } from "bc-minecraft-bedrock-types";

interface Item extends Types.OffsetWord {
  data?: number;
}

export function behaviorpack_item_diagnose(value: Item|string, diagnoser: DiagnosticsBuilder): boolean {
  let id = typeof value == 'string' ? value : value.text;
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.item, id, diagnoser)) return true;

  //If it is an spawn egg, treat it as an entity
  if (id.endsWith("_spawn_egg")) {
    const entity = { offset: typeof value == 'string' ? 0 : value.offset, text: id.slice(0, id.length - 10) };
    return behaviorpack_entityid_diagnose(entity, diagnoser);
  }

  if (hasAny(id, diagnoser)) {
    if (typeof value == 'string') return true;
    else return checkData(value, diagnoser);
  }

  //Missing namespace?
  if (!id.includes(":")) {
    //retry
    id = "minecraft:" + id;

    if (hasAny(id, diagnoser)) {
      value = { offset: typeof value == 'string' ? 0 : value.offset, text: id };
      return checkData(value, diagnoser);
    }
  }

  //Nothing then report error
  diagnoser.add(
    value,
    `Cannot find behaviorpack item definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.item.missing"
  );
  return false;
}

function hasAny(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const data = diagnoser.context.getProjectData().projectData;

  if (check_definition_value(diagnoser.project.definitions.item, id, diagnoser)) return true;
  if (check_definition_value(diagnoser.project.definitions.block, id, diagnoser)) return true;

  //Project has item Or blocks
  if (data.hasItem(id)) return true;
  if (data.hasBlock(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has item
  if (MinecraftData.BehaviorPack.hasItem(id, edu)) return true;
  if (MinecraftData.BehaviorPack.hasBlock(id, edu)) return true;

  return false;
}

function checkData(value: Item, diagnoser: DiagnosticsBuilder): boolean {
  const edu = education_enabled(diagnoser);

  const item = MinecraftData.BehaviorPack.getItem(value.text, edu);
  if (item && typeof value.data === "number") {
    if (value.data <= item.max_damage) {
      diagnoser.add(
        value,
        `Item data is for ${value.text} is 0..${item.max_damage}`,
        DiagnosticSeverity.error,
        "behaviorpack.item.data"
      );
    }
  }

  return true;
}
