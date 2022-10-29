import { ComponentBehavior, ComponentContainer } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Components";
import { DiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../Utility/components";
import { ComponentCheck, components_check, component_error } from "../../../../Utility/components/checks";

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
  //TODO minecraft:collision_box
  //TODO minecraft:geometry
};
