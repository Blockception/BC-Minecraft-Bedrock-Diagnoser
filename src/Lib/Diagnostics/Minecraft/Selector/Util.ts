import { CompactJson } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Json";
import { Selector } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector";
import { OffsetWord } from "bc-minecraft-bedrock-types/lib/src/Types";
import { Diagnoser, DiagnosticSeverity } from "../../../Types";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder";

export type diagnoseAttribute = (
  attribute: CompactJson.IKeyNode,
  sel: Selector,
  diagnoser: DiagnosticsBuilder
) => boolean;
export type diagnoseAttributes = (
  attributes: CompactJson.IKeyNode[],
  sel: Selector,
  diagnoser: DiagnosticsBuilder
) => boolean;

/**
 *
 * @param fn
 * @returns
 */
export function all(...fn: diagnoseAttributes[]): diagnoseAttributes {
  return (attr: CompactJson.IKeyNode[], sel: Selector, diagnoser: DiagnosticsBuilder) => {
    let result = true;

    for (const f of fn) {
      result = result && f(attr, sel, diagnoser);
    }

    return result;
  };
}

export function forEach(fn: diagnoseAttribute): diagnoseAttributes {
  return (attr: CompactJson.IKeyNode[], sel: Selector, diagnoser: DiagnosticsBuilder) => {
    let result = true;

    for (const a of attr) {
      result = result && fn(a, sel, diagnoser);
    }

    return result;
  };
}

export function must_offset_word(
  fn: (value: OffsetWord, diagnoser: DiagnosticsBuilder) => boolean
): diagnoseAttributes {
  return forEach((attr, sel, diagnoser) => {
    if (CompactJson.isString(attr)) {
      const offset = CompactJson.valueToOffsetWord(attr);
      return fn(offset, diagnoser);
    }

    diagnoser.Add(
      CompactJson.toOffsetWord(attr),
      "Expected a string",
      DiagnosticSeverity.error,
      "minecraft.selector.attribute.string"
    );
    return false;
  });
}