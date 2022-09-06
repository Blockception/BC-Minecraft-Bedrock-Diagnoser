import { behaviorpack_check_blockid } from "../Block/diagnose";
import { check_definition_value, education_enabled } from "../../Definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { Types } from "bc-minecraft-bedrock-types";

interface Item extends Types.OffsetWord {
  data?: number;
}

export function behaviorpack_item_diagnose(value: Item, diagnoser: DiagnosticsBuilder): boolean {
  let id = value.text;
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.item, id, diagnoser)) return true;

  const data = diagnoser.context.getCache();

  //Project has item
  if (data.BehaviorPacks.items.has(id)) return true;

  //Missing namespace?
  if (!id.includes(":")) {
    //retry
    id = "minecraft:" + id;

    //Defined in McProject
    if (check_definition_value(diagnoser.project.definitions.item, id, diagnoser)) return true;

    //Project has item
    if (data.hasItem(id)) return true;
  }

  //Vanilla has item
  if (MinecraftData.BehaviorPack.hasItem(id, education_enabled(diagnoser))) return true;

  //Is it a block item?
  if (behaviorpack_check_blockid(value, diagnoser)) return true;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find behaviorpack item definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.item.missing");
  return false;
}
