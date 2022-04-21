import { Selector } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector/Selector";
import { SelectorValueAttribute } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector/ValueAttribute";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { behaviorpack_entityid_diagnose } from "../../BehaviorPack/Entity/diagnose";
import { general_float_diagnose, general_positive_float_diagnose } from "../../General/Float";
import { general_integer_diagnose, general_positive_integer_diagnose } from "../../General/Integer";
import { mode_gamemode_diagnose, mode_selectorattribute_diagnose } from "../../Mode/diagnose";
import { minecraft_family_diagnose } from "../Family";
import { minecraft_name_diagnose } from "../Name";
import { minecraft_tag_diagnose } from "../Tag";
import { selector_attributes_duplicate } from "./Checks";
import { selectorattribute_coordinate } from "./Coordinate";

/**
 *
 * @param attr
 * @param sel
 * @param diagnoser
 * @returns
 */
export function minecraft_selector_attribute_diagnose(attr: SelectorValueAttribute, sel: Selector, diagnoser: DiagnosticsBuilder): void {
  //Attribute doesn't exist then skip it
  if (!mode_selectorattribute_diagnose(attr, diagnoser)) return;

  const word = attr.getValue();
  if (word.text.startsWith("!")) {
    word.text = word.text.slice(1);
  }
  const old = word.text;
  word.text = old.trim();
  word.offset += old.indexOf(word.text);

  switch (attr.name) {
    case "rxm":
    case "rx":
      selector_attributes_duplicate(sel.attributes, attr.name, diagnoser);
      general_float_diagnose(word, diagnoser, { min: -90, max: 90 });
      return;

    case "ry":
    case "rym":
      selector_attributes_duplicate(sel.attributes, attr.name, diagnoser);
      general_float_diagnose(word, diagnoser, { min: -180, max: 180 });
      return;

    case "x":
    case "y":
    case "z":
    case "dx":
    case "dy":
    case "dz":
      selector_attributes_duplicate(sel.attributes, attr.name, diagnoser);
      return selectorattribute_coordinate(word, diagnoser);

    case "r":
    case "rm":
      selector_attributes_duplicate(sel.attributes, attr.name, diagnoser);
      general_positive_float_diagnose(word, diagnoser);
      return;

    case "c":
      selector_attributes_duplicate(sel.attributes, attr.name, diagnoser);
      general_integer_diagnose(word, diagnoser);
      return;

    case "l":
    case "lm":
      selector_attributes_duplicate(sel.attributes, attr.name, diagnoser);
      general_positive_integer_diagnose(word, diagnoser);
      return;

    case "m":
      //Types and gamemode can only be tested postive once, but can have all the negative tests
      mode_gamemode_diagnose(word, diagnoser);
      return selectorattribute_postive_all_negatives(attr, sel, diagnoser);

    case "family":
      //Family attribute is allowed multiple tests
      minecraft_family_diagnose(word, diagnoser);
      return selectorattribute_all(attr, sel, diagnoser);

    case "tag":
      //Family attribute is allowed multiple tests
      minecraft_tag_diagnose(word, diagnoser);
      return selectorattribute_all(attr, sel, diagnoser);

    case "type":
      //Types and gamemode can only be tested postive once, but can have all the negative tests
      behaviorpack_entityid_diagnose(word, diagnoser);
      return selectorattribute_postive_all_negatives(attr, sel, diagnoser);

    case "name":
      selectorattribute_postive_all_negatives(attr, sel, diagnoser);
      return minecraft_name_diagnose(word, diagnoser);
  }
}

/**
 *
 * @param value
 * @param selector
 * @param diagnoser
 * @returns
 */
function selectorattribute_postive_all_negatives(value: SelectorValueAttribute, selector: Selector, diagnoser: DiagnosticsBuilder): void {
  //Attribute can only be tested postive once, but can have all the negative tests
  const parameters = selector.get(value.name);

  if (parameters.length <= 1) return;

  const name = value.name;
  const offset = value.offset;

  let Negatives = 0;

  for (let index = 0; index < parameters.length; index++) {
    const element = parameters[index];

    if (SelectorValueAttribute.is(element)) {
      if (element.value.startsWith("!")) Negatives++;
    }
  }

  //If we have less negatives then parameters - 1, then that means there are more positve thens 1
  if (Negatives < parameters.length - 1) {
    diagnoser.Add(
      offset,
      `Parameter: "${name}" can only have 1 positive test or/and multiple negatives test`,
      DiagnosticSeverity.error,
      "selector.attribute.test.postive_allnegatives"
    );
  }
}

/**
 *
 * @param value
 * @param selector
 * @param diagnoser
 * @returns
 */
function selectorattribute_all(value: SelectorValueAttribute, selector: Selector, diagnoser: DiagnosticsBuilder): void {
  const parameters = selector.get(value.name);

  //Just check for duplicate tests
  if (parameters.length <= 1) return;

  const name = value.name;
  const avalue = value.value;
  const offset = value.offset;

  for (let I = 0; I < parameters.length; I++) {
    const first = parameters[I];

    if (first.offset !== offset) {
      if (SelectorValueAttribute.is(first) && first.value == avalue)
        diagnoser.Add(
          offset + name.length + 1,
          `Duplicate test statement found for: "${name}"`,
          DiagnosticSeverity.warning,
          "selector.attribute.test.duplilcate"
        );
    }
  }
}
