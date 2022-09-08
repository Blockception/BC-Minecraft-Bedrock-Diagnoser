import { SelectorItemAttribute, SelectorValueAttribute } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Selector";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { behaviorpack_item_diagnose } from "../../BehaviorPack/Item/diagnose";
import { general_integer_diagnose } from "../../General/Integer";
import { mode_slottype_diagnose } from '../../Mode/diagnose';

export function minecraft_selector_hasitem_diagnose(attr: SelectorItemAttribute, diagnoser: DiagnosticsBuilder): void {
  if (attr.values.length === 0) {
    diagnoser.Add(attr.getName(), "Empty hasitem, can be removed", DiagnosticSeverity.info, "minecraft.selector.attribute.unnesscary");
  }

  attr.values.forEach((value) => minecraft_selector_hasitem_item_diagnose(value, diagnoser));
}

/**
 *
 * @param attr
 * @param diagnoser
 */
function minecraft_selector_hasitem_item_diagnose(attr: SelectorValueAttribute, diagnoser: DiagnosticsBuilder): void {
  const value = attr.value.startsWith("!") ? attr.value.substring(1) : attr.value;
  const value_offset = attr.getValueOffset();
  const valueword = { offset: value_offset, text: value };

  switch (attr.name) {
    case "item":
      behaviorpack_item_diagnose(valueword, diagnoser);
      break;
    case "data":
      general_integer_diagnose(valueword, diagnoser, { min: -1, max: 32767 });
      break;

    case "quantity":
      general_integer_diagnose(valueword, diagnoser, { min: 0, max: 32767 });
      break;

    case "location":
      mode_slottype_diagnose(valueword, diagnoser);
      break;

    case "slot":
      general_integer_diagnose(valueword, diagnoser, { min: 0, max: 53 });

    default:
      diagnoser.Add(
        attr.getName(),
        "Unknown hasitem selector attribute: " + attr.name,
        DiagnosticSeverity.error,
        "minecraft.selector.hasitem.attribute.invalid"
      );
  }
}
