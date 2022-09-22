import { behaviorpack_entityid_diagnose } from "../Entity";
import { check_definition_value, education_enabled } from "../../Definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { Types } from "bc-minecraft-bedrock-types";
import { OffsetWord } from "bc-minecraft-bedrock-types/lib/src/Types";

interface Item extends Types.OffsetWord {
  data?: number;
}

export function behaviorpack_item_diagnose(value: Item, diagnoser: DiagnosticsBuilder): boolean {
  let id = value.text;
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.item, id, diagnoser)) return true;

  //If it is an spawn egg, treat it as an entity
  if (id.endsWith("_spawn_egg")) {
    const entity = { offset: value.offset, text: id.slice(0, id.length - 10) };
    return behaviorpack_entityid_diagnose(entity, diagnoser);
  }

  if (hasAny(id, diagnoser)) return checkData(value, diagnoser);

  //Missing namespace?
  if (!id.includes(":")) {
    //retry
    id = "minecraft:" + id;

    if (hasAny(id, diagnoser)) {
      value = { offset: value.offset, text: id };
      return checkData(value, diagnoser);
    }
  }

  //Nothing then report error
  diagnoser.Add(
    value,
    `Cannot find behaviorpack item definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.item.missing"
  );
  return false;
}

function hasAny(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const data = diagnoser.context.getCache();

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
      diagnoser.Add(
        value,
        `Item data is for ${value.text} is 0..${item.max_damage}`,
        DiagnosticSeverity.error,
        "behaviorpack.item.data"
      );
    }
  }

  return true;
}
