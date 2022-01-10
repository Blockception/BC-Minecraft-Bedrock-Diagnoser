import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value, education_enabled } from "../../Definitions";

export function behaviorpack_item_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
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

    //Project has block
    if (data.hasItem(id)) return true;
  }

  //Vanilla has block
  if (MinecraftData.BehaviorPack.hasItem(id, education_enabled(diagnoser))) return true;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find behaviorpack item definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.item.missing");
  return false;
}
