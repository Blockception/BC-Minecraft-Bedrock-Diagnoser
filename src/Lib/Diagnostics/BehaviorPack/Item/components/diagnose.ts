import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DocumentDiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../utility/components";
import { component_error, ComponentCheck, components_check } from "../../../../utility/components/checks";
import { behaviorpack_check_blockid } from "../../Block";
import { behaviorpack_entityid_diagnose } from "../../Entity";
import { behaviorpack_item_diagnose } from "../diagnose";
import { minecraft_get_item } from "../../../Minecraft/Items";

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_item_components(
  container: ComponentBehavior,
  context: Context,
  diagnoser: DocumentDiagnosticsBuilder
): void {
  components_check(container, context, diagnoser, component_test);
}

const component_test: Record<string, ComponentCheck> = {
  "minecraft:armor": deprecated_component("minecraft:wearable"),
  "minecraft:chargeable": deprecated_component("minecraft:custom_components"),
  "minecraft:creative_category": deprecated_component("description.menu_category"),
  "minecraft:dye_powder": deprecated_component(),
  "minecraft:knockback_resistance": deprecated_component(),
  "minecraft:render_offsets": deprecated_component("attatchables"),
  "minecraft:animates_in_toolbar": deprecated_component(),
  "minecraft:ignores_permission": deprecated_component(),
  "minecraft:explodable": deprecated_component(),
  "minecraft:foil": deprecated_component("minecraft:glint"),
  "minecraft:mining_speed": deprecated_component(),
  "minecraft:mirrored_art": deprecated_component(),
  "minecraft:on_use_on": deprecated_component("minecraft:custom_components"),
  "minecraft:on_use": deprecated_component("minecraft:custom_components"),
  "minecraft:weapon": deprecated_component("minecraft:custom_components"),
  "minecraft:use_duration": deprecated_component(),
  "minecraft:fertilizer": deprecated_component(),
  "minecraft:frame_count": deprecated_component(),
  "minecraft:requires_interact": deprecated_component(),
  "minecraft:map": deprecated_component(),
  "minecraft:shears": deprecated_component(),
  "minecraft:bucket": deprecated_component(),
  saddle: deprecated_component(),
  "minecraft:entity_placer": (name, component, context, diagnoser) => {
    if (Array.isArray(component.dispense_on))
      component.dispense_on.forEach((block: string) => {
        behaviorpack_check_blockid(block, diagnoser);
      });
    if (Array.isArray(component.use_on))
      component.use_on.forEach((block: string) => {
        behaviorpack_check_blockid(block, diagnoser);
      });
    if (component.entity) behaviorpack_entityid_diagnose(component.entity, diagnoser);
  },
  "minecraft:block_placer": (name, component, context, diagnoser) => {
    if (Array.isArray(component.use_on))
      component.use_on.forEach((block: string) => {
        behaviorpack_check_blockid(block, diagnoser);
      });
    if (component.block) behaviorpack_check_blockid(component.block, diagnoser);
  },
  "minecraft:projectile": (name, component, context, diagnoser) => {
    if (component.projectile_entity) behaviorpack_entityid_diagnose(component.projectile_entity, diagnoser);
  },
  "minecraft:repairable": (name, component, context, diagnoser) => {
    if (Array.isArray(component.repair_items))
      component.repair_items.forEach((repairEntry: any) => {
        if (Array.isArray(repairEntry.items))
          repairEntry.items.forEach((item: string) => {
            behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
          });
      });
  },
  // TODO: Check if icon points to valid item_texture
};

function deprecated_component(replacement?: string) {
  const str = replacement ? ", replace with " + replacement : "";
  return component_error(
    "This component is no longer supported" + str + ". You are recommended to use the latest format version.",
    "behaviorpack.item.components.deprecated"
  );
}
