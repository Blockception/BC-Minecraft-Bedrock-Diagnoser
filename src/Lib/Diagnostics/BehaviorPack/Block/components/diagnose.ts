import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/src/minecraft/components";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../Types";
import { Context } from "../../../../utility/components";
import { ComponentCheck, components_check, component_error } from "../../../../utility/components/checks";
import { resourcepack_has_model } from "../../../ResourcePack/Model/diagnose";
import { check_geo_and_rules } from '../../../ResourcePack/BlockCulling';
import { behaviorpack_loot_table_diagnose } from '../../Loot Table';
import { behaviorpack_check_blockid } from '../diagnose';

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
  "minecraft:destroy_time": deprecated_component('minecraft:destructible_by_mining'),
  "minecraft:block_light_emission": deprecated_component('minecraft:light_emission'),
  "minecraft:block_light_absorption": deprecated_component('minecraft:light_dampening'),
  "minecraft:block_light_filter": deprecated_component('minecraft:light_dampening'),
  "minecraft:explosion_resistance": deprecated_component('minecraft:destructible_by_explosion'),
  "minecraft:entity_collision": deprecated_component('minecraft:collision_box'),
  "minecraft:block_collision": deprecated_component('minecraft:selection_box'),
  "minecraft:pick_collision": deprecated_component('minecraft:selection_box'),
  "minecraft:aim_collision": deprecated_component('minecraft:selection_box'),
  "minecraft:rotation": deprecated_component('minecraft:transformation'),
  "minecraft:breathability": deprecated_component(),
  "minecraft:partial_visibility": deprecated_component('minecraft:geometry.bone_visibility'),
  "minecraft:creative_category": deprecated_component('description.menu_category'),
  "minecraft:queued_ticking": deprecated_component( 'minecraft:custom_components'),
  "minecraft:random_ticking": deprecated_component( 'minecraft:custom_components'),
  "minecraft:on_step_on": deprecated_component( 'minecraft:custom_components'),
  "minecraft:on_step_off": deprecated_component( 'minecraft:custom_components'),
  "minecraft:on_player_destroyed": deprecated_component('minecraft:custom_components'),
  "minecraft:on_fall_on": deprecated_component('minecraft:custom_components'),
  "minecraft:on_placed": deprecated_component('minecraft:custom_components'),
  "minecraft:on_player_placing": deprecated_component('minecraft:custom_components'),
  "minecraft:on_interact": deprecated_component('minecraft:custom_components'),
  "minecraft:unit_cube": deprecated_component('geometry.minecraft:full_block'),
  "minecraft:breakonpush": deprecated_component(),
  "minecraft:immovable": deprecated_component(),
  "minecraft:onlypistonpush": deprecated_component(),
  "minecraft:preventsjumping": deprecated_component(),
  "minecraft:unwalkable": deprecated_component(),
  "minecraft:destructible_by_mining": (name, component, context, diagnoser) => {
    const destroyTime = component.seconds_to_destroy;
    if (!destroyTime) return;
    component.item_specific_speeds?.forEach((specific_speed: any) => {
        if (specific_speed.destroy_speed && specific_speed.destroy_speed > destroyTime) {
          diagnoser.add(
            specific_speed.destroy_speed,
            `Item specific destroy speed ${specific_speed.destroy_speed} cannot be higher than block's destroy time ${destroyTime}`,
            DiagnosticSeverity.error,
            "behaviorpack.block.components.fast_break_speed"
          );
          return false;
        }
    });
  },
  "minecraft:placement_filter": (name, component, context, diagnoser) => {
    for (const condition of component.conditions) {
      condition.block_filter?.forEach((block: string) => {
        behaviorpack_check_blockid(block, diagnoser)
      });
    }
  },
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

function deprecated_component(replacement?: string) {
  let str = replacement ? ", replace with " + replacement : ''
  return component_error("This component is no longer supported" + str + '. You are recommended to use the latest format version.', 'behaviorpack.block.components.deprecated')
}
