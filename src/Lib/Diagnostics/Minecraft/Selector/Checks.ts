import { SelectorAttribute } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector/Selector";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/Severity";

/**
 *
 * @param value
 * @param attr
 * @param diagnoser
 * @returns
 */
export function selector_attributes_duplicate(value: SelectorAttribute[], attr: string, diagnoser: DiagnosticsBuilder): void {
  const attrs = value.filter((a) => a.name === attr);

  if (attrs.length <= 1) return;

  attrs.forEach((item) =>
    diagnoser.Add(
      item.getName(),
      `Duplicate selector attribute: ${attr}, but only one allowed`,
      DiagnosticSeverity.error,
      "minecraft.selector.attribute.duplicate"
    )
  );
}