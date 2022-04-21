import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { Text } from "bc-minecraft-bedrock-project";
import { Minecraft } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from "../Definitions";
import {
  Selector,
  SelectorAttribute,
  SelectorItemAttribute,
  SelectorScoreAttribute,
  SelectorValueAttribute,
} from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector/include";
import { selector_attributes_duplicate } from "./Selector/Checks";
import { minecraft_selector_scores_diagnose } from "./Selector/Scores";
import { minecraft_selector_hasitem_diagnose } from "./Selector/HasItem";
import { minecraft_selector_attribute_diagnose } from "./Selector/General";

/**
 * 
 * @param pattern 
 * @param value 
 * @param diagnoser 
 * @returns 
 */
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
  const selector = Minecraft.Selector.Selector.parse(value.text, value.offset);

  //If the selector is only meant to be aimed at player warn the user
  if (pattern.options?.playerOnly === true) {
    if (selector.type === "@e") {
      diagnoser.Add(value, "Selector is meant to target only players", DiagnosticSeverity.info, "minecraft.selector.playeronly");
    }
  }

  if (!Minecraft.Selector.Selector.isValidType(selector)) {
    diagnoser.Add(value, `Unknown selector type: ${selector.type}`, DiagnosticSeverity.error, "minecraft.selector.type.invalid");
  }

  //Check for duplicate scores definition
  selector_attributes_duplicate(selector.attributes, "scores", diagnoser);
  selector_attributes_duplicate(selector.attributes, "hasitem", diagnoser);

  //Check attributes
  selector.attributes.forEach((attr) => minecraft_selector_attribute_diagnose_hard(attr, selector, diagnoser));
}

export function minecraft_selector_attribute_diagnose_hard(attr: SelectorAttribute, selector: Selector, diagnoser: DiagnosticsBuilder) {
  switch (attr.name) {
    case "scores":
      if (SelectorScoreAttribute.is(attr)) {
        minecraft_selector_scores_diagnose(attr, diagnoser);
      } else {
        diagnoser.Add(attr.getName(), "Scores is not valid", DiagnosticSeverity.error, "minecraft.selector.attribute.invalid");
      }
      break;
    case "hasitem":
      if (SelectorItemAttribute.is(attr)) {
        minecraft_selector_hasitem_diagnose(attr, diagnoser);
      } else {
        diagnoser.Add(attr.getName(), "Hasitem is not valid", DiagnosticSeverity.error, "minecraft.selector.attribute.invalid");
      }
      break;

    default:
      if (SelectorValueAttribute.is(attr)) {
        minecraft_selector_attribute_diagnose(attr, selector, diagnoser);
      } else {
        diagnoser.Add(attr.getName(), attr.name + " is not valid", DiagnosticSeverity.error, "minecraft.selector.attribute.invalid");
      }
      break;
  }
}
