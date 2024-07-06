import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/src/minecraft/components";
import { DiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../utility/components";
import { ComponentCheck, components_check, component_error } from "../../../../utility/components/checks";
import { resourcepack_has_model } from "../../../ResourcePack/Model/diagnose";
import { check_geo_and_rules } from '../../../ResourcePack/BlockCulling';
import { behaviorpack_loot_table_diagnose } from '../../Loot Table';

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
      if (component.identifier) resourcepack_has_model(component.identifier, diagnoser);
      if (component.culling && component.identifier) check_geo_and_rules(component.identifier, component.culling, diagnoser);
    }
  },
  "minecraft:loot": (name, component, context, diagnoser) => {
    if (typeof component === "string") behaviorpack_loot_table_diagnose(component, diagnoser);
  },
};
