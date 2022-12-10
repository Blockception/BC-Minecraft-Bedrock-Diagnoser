import { ComponentBehavior, ComponentContainer } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Components";
import { DiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../Utility/components";
import { ComponentCheck, components_check, component_error } from "../../../../Utility/components/checks";
import { resourcepack_has_model } from "../../../ResourcePack/Model/diagnose";

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_block_components(
  container: ComponentBehavior,
  context: Context,
  diagnoser: DiagnosticsBuilder
): void {
  components_check(container, context, diagnoser, component_test);
}

const component_test: Record<string, ComponentCheck> = {
  "minecraft:creative_category": component_error(
    "Creative category is no longer supported, replace with `description.category`, needs version 1.19.30",
    "behaviorpack.block.components.deprecated"
  ),
  "minecraft:geometry": (name, component, context, diagnoser) => {
    if (typeof component === "string") {
      resourcepack_has_model(component, diagnoser);
    } 
    else if (typeof component === "object") {
      if (component.value) resourcepack_has_model(component.value, diagnoser);
    }
  },
  //TODO minecraft:collision_box
};
