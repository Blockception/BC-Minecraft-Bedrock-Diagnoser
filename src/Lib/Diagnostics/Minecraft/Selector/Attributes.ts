import { CompactJson } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Json";
import { Selector } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector";
import { DiagnosticSeverity } from "../../../Types";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder";
import { general_float_diagnose, general_integer_diagnose, general_positive_float_diagnose } from "../../General";
import {
  selectorattribute_duplicate_check as duplicate_check,
  selectorattribute_one_positive_all_negatives as one_positive_all_negatives,
} from "./General";
import { selectorattribute_coordinate as coordinate } from "./Coordinate";
import { selectorattributes_no_duplicate as no_duplicate } from "./Checks";
import { mode_gamemode_diagnose } from "../../Mode";
import { minecraft_family_diagnose } from "../Family";
import { minecraft_tag_diagnose } from "../Tag";
import { behaviorpack_entityid_diagnose } from "../../BehaviorPack/Entity";
import { minecraft_name_diagnose } from "../Name";
import { selector_scores_diagnose } from "./Scores";
import { minecraft_selector_hasitem_diagnose } from "./HasItem";
import { all, diagnoseAttributes, forEach, must_offset_word } from "./Util";

function float_diagnose(range?: { min: number; max: number }): diagnoseAttributes {
  return must_offset_word((value, diagnoser) => general_float_diagnose(value, diagnoser, range));
}

export const attribute_diagnostics: Record<string, diagnoseAttributes> = {
  c: all(no_duplicate, must_offset_word(general_integer_diagnose)),
  dx: all(no_duplicate, must_offset_word(coordinate)),
  dy: all(no_duplicate, must_offset_word(coordinate)),
  dz: all(no_duplicate, must_offset_word(coordinate)),
  family: all(duplicate_check, must_offset_word(minecraft_family_diagnose)),
  hasitem: all(no_duplicate, forEach(minecraft_selector_hasitem_diagnose)),
  l: all(duplicate_check, must_offset_word(general_integer_diagnose)),
  lm: all(duplicate_check, must_offset_word(general_integer_diagnose)),
  m: all(one_positive_all_negatives, must_offset_word(mode_gamemode_diagnose)),
  name: all(one_positive_all_negatives, must_offset_word(minecraft_name_diagnose)),
  r: all(no_duplicate, must_offset_word(general_positive_float_diagnose)),
  rm: all(no_duplicate, must_offset_word(general_positive_float_diagnose)),
  rx: all(no_duplicate, float_diagnose({ min: -90, max: 90 })),
  rxm: all(no_duplicate, float_diagnose({ min: -90, max: 90 })),
  ry: all(no_duplicate, float_diagnose({ min: -180, max: 180 })),
  rym: all(no_duplicate, float_diagnose({ min: -180, max: 180 })),
  scores: all(no_duplicate, forEach(selector_scores_diagnose)),
  tag: all(duplicate_check, must_offset_word(minecraft_tag_diagnose)),
  type: all(one_positive_all_negatives, must_offset_word(behaviorpack_entityid_diagnose)),
  x: all(no_duplicate, must_offset_word(coordinate)),
  y: all(no_duplicate, must_offset_word(coordinate)),
  z: all(no_duplicate, must_offset_word(coordinate)),
};

export namespace Attribute {
  export function diagnose(
    attribute: string,
    attributes: CompactJson.IKeyNode[],
    sel: Selector,
    diagnoser: DiagnosticsBuilder
  ): boolean {
    const fn = attribute_diagnostics[attribute];

    if (typeof fn === "function") {
      return fn(attributes, sel, diagnoser);
    }

    return defaultAttribute(attribute, attributes, sel, diagnoser);
  }
}

function defaultAttribute(
  attribute: string,
  attributes: CompactJson.INode[],
  sel: Selector,
  diagnoser: DiagnosticsBuilder
): boolean {
  const msg = `Unknown attribute: ${attribute}`;

  attributes.forEach((a) => {
    diagnoser.Add(CompactJson.toOffsetWord(a), msg, DiagnosticSeverity.error, "minecraft.selector.attribute.unknown");
  });

  return false;
}
