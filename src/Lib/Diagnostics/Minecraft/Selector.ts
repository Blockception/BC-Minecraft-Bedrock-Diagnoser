import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { Text } from 'bc-minecraft-bedrock-project';
import { Minecraft } from 'bc-minecraft-bedrock-types';
import { Selector, SelectorAttribute } from 'bc-minecraft-bedrock-types/lib/src/Minecraft/Selector';
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from '../Definitions';
import { general_range_float_diagnose, general_range_integer_diagnose } from '../General/Range';
import { mode_selectorattribute_diagnose } from '../Mode/diagnose';
import { minecraft_coordinate_diagnose } from './Coordinate';
import { minecraft_name_diagnose } from './Name';
import { minecraft_objectives_diagnose } from './Objective';

export function minecraft_selector_diagnose(pattern: ParameterInfo, value: Types.OffsetWord, diagnoser: DiagnosticsBuilder) {
  const sel = value.text;

  //Is a selector?
  if (sel.startsWith("@")) {
    minecraft_selector_diagnose_hard(pattern, value, diagnoser);
    return;
  }

  //Fake entity or named then  
  const name = Text.UnQuote(sel);

  //Fake players have been banned
  if (pattern.options?.allowFakePlayers === false) {
    diagnoser.Add(value, "No fake players / names allowed", DiagnosticSeverity.error, "minecraft.selector.invalid");
    return;
  }

  if (pattern.options?.playerOnly === true) {
    diagnoser.Add(value, "Only players selector allowed to be used", DiagnosticSeverity.error, "minecraft.selector.invalid");
    return;
  }

  const data = diagnoser.context.getCache();
  
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.name, name, diagnoser)) return;

  //Project has defined this fake entity
  if (data.General.fakeEntities.has(name)) return;

  //Found nothing then report
  diagnoser.Add(value, `Cannot find fake entity definition or name for: ${name}`, DiagnosticSeverity.warning, "minecraft.name.missing");
}

/**
 * 
 * @param pattern 
 * @param value 
 * @param diagnoser 
 */
function minecraft_selector_diagnose_hard(pattern: ParameterInfo, value: Types.OffsetWord, diagnoser: DiagnosticsBuilder) {
  const selector = Minecraft.Selector.parse(value.text, value.offset);

  //If the selector is only meant to be aimed at player warn the user
  if (pattern.options?.playerOnly === true) {
    if (selector.type === "@e") {
      diagnoser.Add(selector.offset, "Selector is meant to target only players", DiagnosticSeverity.info, "minecraft.selector.playeronly");
    }
  }

  if (!Minecraft.Selector.isValidType(selector)) {
    diagnoser.Add(selector.offset, `Unknown selector type: ${selector.type}`, DiagnosticSeverity.error, "minecraft.selector.type.invalid");
  }

  //Check for duplicate scores definition
  selector_scores_duplicate(value, diagnoser);

  //Check attributes
  selector.attributes.forEach(attr => minecraft_selector_attribute_diagnose(attr, selector, diagnoser));
  //Scheck scores
  selector.scores.forEach(score => minecraft_selector_score_attribute_diagnose(score, diagnoser));
}

function selector_scores_duplicate(value : Types.OffsetWord, diagnoser : DiagnosticsBuilder) : void {
  const firstIndex = value.text.indexOf('scores={');
  if (firstIndex < 0) return;

  const secondindex = value.text.indexOf('scores={', firstIndex + 5);
  if (secondindex < 0) return;

  diagnoser.Add(value, "Selector has multiple scores definitions. Only one is allowed", DiagnosticSeverity.error, "minecraft.selector.scores.duplicate");
}

/**
 * 
 * @param attr 
 * @param sel 
 * @param diagnoser 
 * @returns 
 */
function minecraft_selector_attribute_diagnose(attr: SelectorAttribute, sel: Selector, diagnoser: DiagnosticsBuilder): void {
  //Attribute doesn't exist then skip it
  if (!mode_selectorattribute_diagnose(attr, diagnoser)) return;

  const value_offset = attr.offset + attr.name.length + 1;
  const not = attr.value.startsWith("!");
  const value = not ? attr.value.substring(1) : attr.value;
  const value_word = Types.OffsetWord.create(value, value_offset);

  switch (attr.name) {
    case "x":
    case "y":
    case "z":
    case "dx":
    case "dy":
    case "dz":
    case "rx":
    case "rxm":
    case "ry":
    case "rym":
      selectorattribute_no_duplicates(attr, sel, diagnoser);
      return selectorattribute_coordinate(value_word, diagnoser);

    case "c":
      selectorattribute_no_duplicates(attr, sel, diagnoser);
      return general_range_integer_diagnose(value_word, diagnoser);

    case "l":
    case "lm":
      selectorattribute_no_duplicates(attr, sel, diagnoser);
      return general_range_float_diagnose(value_word, diagnoser);

    case "m":
    case "type":
      //Types and gamemode can only be tested postive once, but can have all the negative tests
      return selectorattribute_postive_all_negatives(attr, sel, diagnoser);

    case "family":
    case "tag":
      //Family attribute is allowed multiple tests
      return selectorattribute_all(attr, sel, diagnoser);

    case "name":
      selectorattribute_postive_all_negatives(attr, sel, diagnoser);
      return minecraft_name_diagnose(value_word, diagnoser);
  }
}

/**
 * 
 * @param attr 
 * @param diagnoser 
 */
function minecraft_selector_score_attribute_diagnose(attr: SelectorAttribute, diagnoser: DiagnosticsBuilder): void {
  const value_offset = attr.offset + attr.name.length + 1;
  const not = attr.value.startsWith("!");
  const value = not ? attr.value.substring(1) : attr.value;

  //Check objective references
  minecraft_objectives_diagnose(Types.OffsetWord.create(attr.name, attr.offset), diagnoser);

  //Check range value  
  general_range_integer_diagnose(Types.OffsetWord.create(value, value_offset), diagnoser);
}

/**
 *
 * @param name
 * @param selector
 * @param receiver
 */
function selectorattribute_coordinate(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (value.text.startsWith("^"))
    diagnoser.Add(value, 'Selector attribute coordinate cannot be local coordinates types, only relative or absolute', DiagnosticSeverity.error, "selector.coordinate.invalid");

  minecraft_coordinate_diagnose(value, diagnoser)
}

/**
 *
 * @param name
 * @param selector
 * @param receiver
 */
function selectorattribute_no_duplicates(name: SelectorAttribute, selector: Selector, diagnoser: DiagnosticsBuilder): void {
  var Count = selector.count(name.name);

  if (Count > 1) {
    diagnoser.Add(name.offset, `Selector attribute: ${name} can only be used once in a selector`, DiagnosticSeverity.error, "selector.attribute.noduplicate");
  }
}

/**
 * 
 * @param value 
 * @param selector 
 * @param diagnoser 
 * @returns 
 */
function selectorattribute_postive_all_negatives(value: SelectorAttribute, selector: Selector, diagnoser: DiagnosticsBuilder) : void {
  //Attribute can only be tested postive once, but can have all the negative tests
  const parameters = selector.get(value.name);

  if (parameters.length <= 1) return;

  const name = value.name;
  const offset = value.offset;

  let Negatives = 0;

  for (let index = 0; index < parameters.length; index++) {
    const element = parameters[index];

    if (element.value.startsWith("!")) Negatives++;
  }

  //If we have less negatives then parameters - 1, then that means there are more positve thens 1
  if (Negatives < parameters.length - 1) {
    diagnoser.Add(offset, `Parameter: "${name}" can only have 1 positive test or/and multiple negatives test`, DiagnosticSeverity.error, "selector.attribute.test.postive_allnegatives");
  }
}

/**
 * 
 * @param value 
 * @param selector 
 * @param diagnoser 
 * @returns 
 */
function selectorattribute_all(value: SelectorAttribute, selector: Selector, diagnoser: DiagnosticsBuilder) : void {
  const parameters = selector.get(value.name);

  //Just check for duplicate tests
  if (parameters.length <= 1) return;

  const name = value.name;
  const avalue = value.value
  const offset = value.offset;

  for (let I = 0; I < parameters.length; I++) {
    const first = parameters[I];

    if (first.value == avalue && first.offset !== offset)
      diagnoser.Add(offset + name.length + 1, `Duplicate test statement found for: "${name}"`, DiagnosticSeverity.warning, "selector.attribute.test.duplilcate");
  }
}