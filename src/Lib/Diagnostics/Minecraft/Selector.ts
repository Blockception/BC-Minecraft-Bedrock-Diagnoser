import { check_definition_value } from "../Definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types";
import { Minecraft } from "bc-minecraft-bedrock-types";
import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { Text } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { Attribute } from "./Selector/Attributes";
import { CompactJson } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Json";
import { Selector } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector";
import { Mode } from 'bc-minecraft-bedrock-types/lib/src/Modes/ModeCollection';

/**
 *
 * @param pattern
 * @param value
 * @param diagnoser
 * @returns
 */
export function minecraft_selector_diagnose(
  pattern: ParameterInfo,
  value: Types.OffsetWord,
  diagnoser: DiagnosticsBuilder
) {
  const sel = value.text;

  //Is a selector?
  if (sel.startsWith("@")) {
    minecraft_selector_diagnose_hard(value, diagnoser, pattern);
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
    diagnoser.Add(
      value,
      "Only players selector allowed to be used",
      DiagnosticSeverity.error,
      "minecraft.selector.invalid"
    );
    return;
  }

  const data = diagnoser.context.getCache();

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.name, name, diagnoser)) return;

  //Project has defined this fake entity
  if (data.General.fakeEntities.has(name)) return;

  //Found nothing then report
  diagnoser.Add(
    value,
    `Cannot find fake entity definition or name for: ${name}`,
    DiagnosticSeverity.warning,
    "minecraft.fakeentity.missing"
  );
}

/**
 * Diagnoses a selector
 * @param pattern
 * @param value
 * @param diagnoser
 */
function minecraft_selector_diagnose_hard(
  value: Types.OffsetWord,
  diagnoser: DiagnosticsBuilder,
  pattern: ParameterInfo
): boolean {
  const selector = Minecraft.Selector.Selector.parse(value.text, value.offset);

  if (selector === undefined) {
    diagnoser.Add(value, "Invalid selector", DiagnosticSeverity.error, "minecraft.selector.invalid");
    return false;
  }
  let result = true;

  //If the selector is only meant to be aimed at player warn the user
  if (pattern.options?.playerOnly === true) {
    switch (selector.selectorType) {
      case "@e":
      case "@v":
        result = false;
        diagnoser.Add(
          value,
          "Selector is meant to target only players",
          DiagnosticSeverity.info,
          "minecraft.selector.playeronly"
        );
        break;
    }
  }

  if (!Minecraft.Selector.Selector.isValidType(selector)) {
    result = false;
    diagnoser.Add(
      value,
      `Unknown selector type: ${selector.type}`,
      DiagnosticSeverity.error,
      "minecraft.selector.type.invalid"
    );
  }

  //Check attributes
  const names = selector.names();

  for (const name of names) {
    const attributes = selector.get(name);
    //No attribute then next
    if (attributes) {
      result &&= minecraft_selector_attribute_diagnose_hard(
        name,
        attributes as CompactJson.IKeyNode[],
        selector,
        diagnoser
      );
    }
  }

  return result;
}

/**
 * Diagnoses a selector attribute
 * @param attribute The attribute to diagnose
 * @param attributes The attributes to diagnose
 * @param selector The selector to diagnose
 * @param diagnoser The diagnoser to use
 * @returns Returns true when the attribute is valid
 */
export function minecraft_selector_attribute_diagnose_hard(
  attribute: string,
  attributes: CompactJson.IKeyNode[],
  selector: Selector,
  diagnoser: DiagnosticsBuilder
): boolean {
  return Attribute.diagnose(attribute, attributes as Minecraft.Json.CompactJson.IKeyNode[], selector, diagnoser);
}
