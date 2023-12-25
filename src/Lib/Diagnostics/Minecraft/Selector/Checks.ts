import { CompactJson } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Json";
import { Selector } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types";

/**
 * Checking if the given attribute is the only one.
 * @param attrs The attributes to check
 * @param sel The selector
 * @param diagnoser The diagnoser
 * @returns True if the attribute is the only one, false otherwise
 */
export function selectorattributes_no_duplicate(
  attrs: CompactJson.IKeyNode[],
  sel: Selector,
  diagnoser: DiagnosticsBuilder
): boolean {
  if (attrs.length <= 1) return true;

  attrs.forEach((item) =>
    diagnoser.add(
      CompactJson.toOffsetWord(item),
      `Duplicate selector attribute: ${item.key}, but only one allowed`,
      DiagnosticSeverity.error,
      "minecraft.selector.attribute.noduplicate"
    )
  );

  return false;
}
