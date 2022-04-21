import { Types } from 'bc-minecraft-bedrock-types';
import { SelectorScoreAttribute } from 'bc-minecraft-bedrock-types/lib/src/Minecraft/Selector/ScoreAttribute';
import { SelectorValueAttribute } from 'bc-minecraft-bedrock-types/lib/src/Minecraft/Selector/ValueAttribute';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../../main';
import { general_range_integer_diagnose } from '../../General/Range';
import { minecraft_objectives_diagnose } from '../Objective';


/**
 *
 * @param attr
 * @param diagnoser
 */
export function minecraft_selector_scores_diagnose(attr: SelectorScoreAttribute, diagnoser: DiagnosticsBuilder): void {
  if (attr.values.length === 0) {
    diagnoser.Add(attr.getName(), "Empty scores, can be removed", DiagnosticSeverity.info, "minecraft.selector.attribute.unnesscary");
  }

  attr.values.forEach((value) => minecraft_selector_scores_item_diagnose(value, diagnoser));
}

/**
 * 
 * @param attr 
 * @param diagnoser 
 */
function minecraft_selector_scores_item_diagnose(attr: SelectorValueAttribute, diagnoser: DiagnosticsBuilder): void {
  const value_offset = attr.offset + attr.name.length + 1;
  const not = attr.value.startsWith("!");
  const value = not ? attr.value.substring(1) : attr.value;

  //Check objective references
  minecraft_objectives_diagnose(Types.OffsetWord.create(attr.name, attr.offset), diagnoser);

  //Check range value
  general_range_integer_diagnose(Types.OffsetWord.create(value, value_offset), diagnoser);
}