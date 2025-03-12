import { Internal } from "bc-minecraft-bedrock-project";
import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../utility/components";
import { component_error, ComponentCheck, components_check } from "../../../../utility/components/checks";
import { minecraft_get_item } from "../../../Minecraft/Items";
import { behaviorpack_check_blockid } from "../../Block";
import { behaviorpack_entityid_diagnose } from "../../Entity";
import { behaviorpack_item_diagnose } from "../diagnose";
import { FormatVersion } from 'bc-minecraft-bedrock-types/lib/minecraft';
import { resourcepack_particle_diagnose } from '../../../ResourcePack/Particle';

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_item_components(
  container: ComponentBehavior,
  context: Context<Internal.BehaviorPack.Item>,
  diagnoser: DocumentDiagnosticsBuilder
): void {
  components_check(container, context, diagnoser, component_test);
}

const component_test: Record<string, ComponentCheck<Internal.BehaviorPack.Item>> = {
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
      component.dispense_on.forEach((block: string | { name: string }) => {
        if (typeof block == 'object' && 'name' in block) behaviorpack_check_blockid(block.name, diagnoser)
        else if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
      });
    if (Array.isArray(component.use_on))
      component.use_on.forEach((block: string | { name: string }) => {
        if (typeof block == 'object' && 'name' in block) behaviorpack_check_blockid(block.name, diagnoser)
        else if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
      });
    if (component.entity) behaviorpack_entityid_diagnose(component.entity, diagnoser);
  },
  "minecraft:block_placer": (name, component, context, diagnoser) => {
    if (Array.isArray(component.use_on))
      component.use_on.forEach((block: string | { name: string }) => {
        if (typeof block == 'object' && 'name' in block) behaviorpack_check_blockid(block.name, diagnoser)
        else if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
      });
    if (component.replace_block_item && context.source['minecraft:item'].description.identifier != component.block) diagnoser.add(`minecraft:block_placer/block/${component.block}`,
      `${component.replace_block_item} and ${context.source['minecraft:item'].description.identifier} need to match when trying to replace the block item`,
      DiagnosticSeverity.error,
      'behaviorpack.item.components.replace_block_ids_dont_match')
    if (component.block) {
      if (typeof component.block == 'object' && 'name' in component.block) behaviorpack_check_blockid((component.block as { name: string }).name, diagnoser)
      else if (typeof component.block == 'string') behaviorpack_check_blockid(component.block, diagnoser);
    }
  },
  "minecraft:projectile": (name, component, context, diagnoser) => {
    if (component.projectile_entity) behaviorpack_entityid_diagnose(component.projectile_entity, diagnoser);
  },
  "minecraft:repairable": (name, component, context, diagnoser) => {
    if (Array.isArray(component.repair_items))
      component.repair_items.forEach((repairEntry: any) => {
        if (Array.isArray(repairEntry.items))
          repairEntry.items.forEach((item: string) => {
            if (typeof item == 'string') behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
          });
      });
  },
  "minecraft:icon": (name, component, context, diagnoser) => {
    let textureId: string | undefined = undefined;
    if (typeof component == 'string') textureId = component
    else if (typeof component.texture == 'string') textureId = component.texture
    if (textureId !== undefined) {
      if (!diagnoser.context.getCache().resourcePacks.itemTextures.find(val => val.id == textureId))
        diagnoser.add(textureId,
          `Texture reference "${textureId}" was not defined in item_texture.json`,
          DiagnosticSeverity.error,
          'behaviorpack.item.components.texture_not_found')
    } else {
      Object.keys(component.textures)?.forEach(value => {
        const textureId = component.textures[value];
        if (!diagnoser.context.getCache().resourcePacks.itemTextures.find(val => val.id == textureId))
          diagnoser.add(textureId,
            `Texture reference "${textureId}" was not defined in item_texture.json`,
            DiagnosticSeverity.error,
            'behaviorpack.item.components.texture_not_found')
      })
    }

  },
  "minecraft:custom_components": (name, component, context, diagnoser) => {
    try {
      const version = FormatVersion.parse(context.source.format_version);
      if (version[0] < 1 || version[1] < 21 || (version[2] < 10 && version[1] <= 21)) diagnoser.add(context.source.format_version,
        `To use custom components, a minimum format version of 1.21.10 is required`,
        DiagnosticSeverity.error,
        'behaviorpack.item.components.custom_components_min_version')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Leaving this empty as the base diagnoser should already flag an invalid format version
    }
  },
  "minecraft:durability_sensor": (name, component, context, diagnoser) => {
    if (!component.particle_type || !(typeof component.particle_type == 'string')) return;
    resourcepack_particle_diagnose(component.particle_type, diagnoser)
  }
};

function deprecated_component(replacement?: string) {
  const str = replacement ? ", replace with " + replacement : "";
  return component_error(
    "This component is no longer supported" + str + ". You are recommended to use the latest format version.",
    "behaviorpack.item.components.deprecated"
  );
}
