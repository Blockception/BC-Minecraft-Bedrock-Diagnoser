import { Types } from "bc-minecraft-bedrock-types";
import { Selector } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector";
import { CompactJson } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Json";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../main";
import { general_range_integer_diagnose } from "../../General/Range";
import { minecraft_objectives_diagnose } from "../Objective";

/**
 * Diagnoses the scores attribute from a selector
 * @param attr The attribute to diagnose
 * @param diagnoser The diagnoser to use
 */
export function selector_scores_diagnose(
  attr: CompactJson.IKeyNode,
  sel: Selector,
  diagnoser: DiagnosticsBuilder
): boolean {
  let result = true;
  if (!CompactJson.isObject(attr)) {
    const type = CompactJson.Type[attr.type];

    result = false;
    diagnoser.Add(
      CompactJson.toOffsetWord(attr),
      `Expected a object, not a ${type}`,
      DiagnosticSeverity.error,
      "minecraft.selector.attribute.scores.type"
    );
  }

  return minecraft_selector_scores_item_diagnose(attr, diagnoser) && result;
}

/**
 * Diagnoses a single item from a selector scores attribute
 * @param attr The score attribute to diagnose
 * @param diagnoser The diagnoser to use
 */
function minecraft_selector_scores_item_diagnose(attr: CompactJson.IKeyNode, diagnoser: DiagnosticsBuilder): boolean {
  if (!CompactJson.isString(attr)) {
    const type = CompactJson.Type[attr.type];

    diagnoser.Add(
      CompactJson.toOffsetWord(attr),
      `Expected a range / integer value, not a ${type}`,
      DiagnosticSeverity.error,
      "minecraft.selector.attribute.scores.item.type"
    );
    return false;
  }

  //Check objective references
  let result = minecraft_objectives_diagnose(Types.OffsetWord.create(attr.key, attr.offset), diagnoser);

  //Check range value
  return general_range_integer_diagnose(CompactJson.valueToOffsetWord(attr), diagnoser) && result;
}
