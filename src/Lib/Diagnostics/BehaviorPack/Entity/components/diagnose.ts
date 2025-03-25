import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../utility/components";
import { component_error, ComponentCheck, components_check } from "../../../../utility/components/checks";
import { behaviorpack_entity_components_filters } from './filters';
import { check_loot_table } from "./loot";
import { check_trade_table } from "./trade";
import { Internal } from 'bc-minecraft-bedrock-project';
import { FormatVersion } from 'bc-minecraft-bedrock-types/lib/minecraft';
import { diagnose_resourcepack_sound } from '../../../ResourcePack/Sounds';
import { behaviorpack_entityid_diagnose } from '../diagnose';
import { minecraft_diagnose_filters } from '../../../Minecraft/Filter';
import { behaviorpack_check_blockid } from '../../Block';
import { behaviorpack_item_diagnose } from '../../Item';
import { minecraft_family_diagnose, minecraft_get_item } from '../../../Minecraft';
import { behaviorpack_loot_table_diagnose } from '../../Loot Table';

//TODO: Filters for entity_types

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_entity_components(
  container: ComponentBehavior,
  context: Context<Internal.BehaviorPack.Entity>,
  diagnoser: DocumentDiagnosticsBuilder
): void {
  components_check(container, context, diagnoser, component_test);

  behaviorpack_entity_components_filters(container, diagnoser);
}

const component_test: Record<string, ComponentCheck<Internal.BehaviorPack.Entity>> = {
  "minecraft:behavior.admire_item": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_admire_item_start?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_admire_item_stop?.filters, diagnoser)
  },
  "minecraft:behavior.avoid_block": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_escape?.filters, diagnoser)
    component.target_blocks?.forEach((block: string) => {
      behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:behavior.avoid_mob_type": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_escape_event?.filters, diagnoser)
  },
  "minecraft:behavior.beg": (name, component, context, diagnoser) => {
    component.items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:behavior.celebrate": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_celebration_end_event?.filters, diagnoser)
  },
  "minecraft:behavior.celebrate_survive": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_celebration_end_event?.filters, diagnoser)
  },
  "minecraft:behavior.charge_held_item": (name, component, context, diagnoser) => {
    component.items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:behavior.croak": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.defend_trusted_target": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_defend_start?.filters, diagnoser)
  },
  "minecraft:behavior.delayed_attack": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_attack?.filters, diagnoser)
  },
  "minecraft:behavior.dig": (name, component, context, diagnoser) => { //TODO: Check if requires warden runtime
    minecraft_diagnose_filters(component.on_start?.filters, diagnoser)
  },
  "minecraft:behavior.dragonchargeplayer": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragondeath": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragonflaming": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragonholdingpattern": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragonlanding": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragonscanning": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragonstrafeplayer": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.dragontakeoff": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:behavior.drink_milk": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.drink_potion": (name, component, context, diagnoser) => {
    component.potions?.forEach((obj: any) => {
      minecraft_diagnose_filters(obj.filters, diagnoser)
    });
  },
  "minecraft:behavior.drop_item_for": (name, component, context, diagnoser) => {
    if (typeof component.loot_table === 'string') behaviorpack_loot_table_diagnose(component.loot_table, diagnoser)
    minecraft_diagnose_filters(component.on_drop_attempt?.filters, diagnoser)
  },
  "minecraft:behavior.eat_block": (name, component, context, diagnoser) => {
    component.eat_and_replace_block_pairs?.forEach((obj: any) => {
      if (obj.eat_block) behaviorpack_check_blockid(obj.eat_block, diagnoser);
      if (obj.replace_block) behaviorpack_check_blockid(obj.replace_block, diagnoser);
    });
    minecraft_diagnose_filters(component.on_eat?.filters, diagnoser)
  },
  "minecraft:behavior.eat_mob": (name, component, context, diagnoser) => {
    if (typeof component.loot_table === 'string') behaviorpack_loot_table_diagnose(component.loot_table, diagnoser)
  },
  "minecraft:behavior.emerge": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_done?.filters, diagnoser)
  },
  "minecraft:behavior.enderman_leave_block": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:enderman')
  },
  "minecraft:behavior.enderman_take_block": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:enderman')
  },
  "minecraft:behavior.fire_at_target": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
    if (typeof component.projectile_def === 'string') behaviorpack_entityid_diagnose(component.projectile_def, diagnoser)
  },
  "minecraft:behavior.go_and_give_items_to_noteblock": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_item_throw?.filters, diagnoser)
  },
  "minecraft:behavior.go_and_give_items_to_owner": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_item_throw?.filters, diagnoser)
  },
  "minecraft:behavior.go_home": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_failed?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_home?.filters, diagnoser)
  },
  "minecraft:behavior.guardian_attack": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:elder_guardian', 'minecraft:guardian'])
  },
  "minecraft:behavior.jump_around_target": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.jump_to_block": (name, component, context, diagnoser) => {
    component.forbidden_blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
    component.preferred_blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:behavior.knockback_roar": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.damage_filters, diagnoser)
    minecraft_diagnose_filters(component.knockback_filters, diagnoser)
    minecraft_diagnose_filters(component.on_roar_end?.filters, diagnoser)
  },
  "minecraft:behavior.lay_egg": (name, component, context, diagnoser) => {
    if (typeof component.egg_type == 'string') behaviorpack_check_blockid(component.egg_type, diagnoser);
    minecraft_diagnose_filters(component.on_lay?.filters, diagnoser)
    component.target_blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:behavior.look_at_entity": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.make_love": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:villager', 'minecraft:villager_v2'])
  },
  "minecraft:behavior.melee_attack": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_attack?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_kill?.filters, diagnoser)
  },
  "minecraft:behavior.melee_box_attack": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_attack?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_kill?.filters, diagnoser)
  },
  "minecraft:behavior.mingle": (name, component, context, diagnoser) => {
    if (typeof component.mingle_partner_type == 'string') behaviorpack_entityid_diagnose(component.mingle_partner_type, diagnoser)
    else if (Array.isArray(component.mingle_partner_type)) component.mingle_partner_type.forEach((id: string) => {
      behaviorpack_entityid_diagnose(id, diagnoser)
    });
  },
  "minecraft:behavior.move_around_target": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.move_to_block": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_reach?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_stay_completed?.filters, diagnoser)
    component.target_blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:behavior.offer_flower": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.pickup_items": (name, component, context, diagnoser) => {
    component.excluded_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:behavior.play_dead": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.raid_garden": (name, component, context, diagnoser) => {
    component.blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:behavior.ram_attack": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_start?.filters, diagnoser)
  },
  "minecraft:behavior.random_search_and_dig": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_digging_start?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_fail_during_digging?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_fail_during_searching?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_item_found?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_searching_start?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_success?.filters, diagnoser)
    if (typeof component.item_table === 'string') behaviorpack_loot_table_diagnose(component.item_table, diagnoser)
    component.target_blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:behavior.receive_love": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:villager', 'minecraft:villager_v2'])
  },
  "minecraft:behavior.silverfish_merge_with_stone": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:silverfish')
  },
  "minecraft:behavior.silverfish_wake_up_friends": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:silverfish')
  },
  "minecraft:behavior.skeleton_horse_trap": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:horse', 'minecraft:donkey', 'minecraft:mule', 'minecraft:skeleton_horse'])
  },
  "minecraft:behavior.slime_float": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:magma_cube', 'minecraft:slime'])
  },
  "minecraft:behavior.snacking": (name, component, context, diagnoser) => {
    component.items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:behavior.sneeze": (name, component, context, diagnoser) => {
    if (typeof component.loot_table === 'string') behaviorpack_loot_table_diagnose(component.loot_table, diagnoser)
  },
  "minecraft:behavior.squid_dive": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:squid', 'minecraft:glow_squid'])
  },
  "minecraft:behavior.squid_flee": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:squid', 'minecraft:glow_squid'])
  },
  "minecraft:behavior.squid_idle": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:squid', 'minecraft:glow_squid'])
  },
  "minecraft:behavior.squid_move_away_from_ground": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:squid', 'minecraft:glow_squid'])
  },
  "minecraft:behavior.squid_out_of_water": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, ['minecraft:squid', 'minecraft:glow_squid'])
  },
  "minecraft:behavior.stomp_attack": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_attack?.filters, diagnoser)
  },
  "minecraft:behavior.summon_entity": (name, component, context, diagnoser) => {
    //TODO: Complete
  },
  "minecraft:behavior.swoop_attack": (name, component, context, diagnoser) => {
    if (!diagnoser.document.getText().includes('movement.glide')) diagnoser.add(name,
      "This component requires 'minecraft:movement.glide' to function",
      DiagnosticSeverity.warning,
      "behaviorpack.entity.components.swoop_attack"
    )
  },
  "minecraft:behavior.take_flower": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.teleport_to_owner": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:behavior.tempt": (name, component, context, diagnoser) => {
    component.items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:behavior.timer_flag_1": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_start?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_end?.filters, diagnoser)
  },
  "minecraft:behavior.timer_flag_2": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_start?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_end?.filters, diagnoser)
  },
  "minecraft:behavior.timer_flag_3": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_start?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_end?.filters, diagnoser)
  },
  "minecraft:behavior.wither_random_attack_pos_goal": (name, component, context, diagnoser) => {
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:wither')
  },
  "minecraft:behavior.work": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_arrival?.filters, diagnoser)
  },
  "minecraft:behavior.work_composter": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_arrival?.filters, diagnoser)
  },
  "minecraft:addrider": (name, component, context, diagnoser) => {
    if (typeof component.entity_type === 'string') behaviorpack_entityid_diagnose(component.entity_type, diagnoser)
  },
  "minecraft:ageable": (name, component, context, diagnoser) => {
    component.drop_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
    
    if (Array.isArray(component.feed_items)) component.feed_items?.forEach((item: string | any) => {
      if (typeof item == 'string') behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
      else if (typeof item.feed_items == 'string') behaviorpack_item_diagnose(minecraft_get_item(item.item, diagnoser.document), diagnoser);
    });
    else if (typeof component.feed_items == 'string') behaviorpack_item_diagnose(minecraft_get_item(component.feed_items, diagnoser.document), diagnoser);
    minecraft_diagnose_filters(component.grow_up?.filters, diagnoser)
    minecraft_diagnose_filters(component.interact_filters, diagnoser)
    if (typeof component.transform_to_item === 'string') behaviorpack_item_diagnose(minecraft_get_item(component.transform_to_item, diagnoser.document), diagnoser);
  },
  "minecraft:anger_level": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.nuisance_filter, diagnoser)
  },
  "minecraft:angry": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.broadcast_filters, diagnoser)
  },
  "minecraft:area_attack": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.entity_filter, diagnoser)
  },
  "minecraft:barter": (name, component, context, diagnoser) => {
    if (typeof component.barter_table) behaviorpack_loot_table_diagnose(component.barter_table, diagnoser)
  },
  "minecraft:block_sensor": (name, component, context, diagnoser) => {
    component.on_break?.forEach((entry: any) => {
      entry.block_list?.forEach((block: string) => {
        if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
      });
    });
    component.sources?.forEach((entry: any) => {
      minecraft_diagnose_filters(entry, diagnoser)
    });
  },
  "minecraft:boostable": (name, component, context, diagnoser) => {
    component.boost_items?.forEach((entry: any) => {
      if (typeof entry.item == 'string') behaviorpack_item_diagnose(minecraft_get_item(entry.item, diagnoser.document), diagnoser);
      if (typeof entry.replace_item == 'string') behaviorpack_item_diagnose(minecraft_get_item(entry.replace_item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:break_blocks": (name, component, context, diagnoser) => {
    component.block_list?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:breedable": (name, component, context, diagnoser) => {
    if (Array.isArray(component.breed_items)) component.breed_items?.forEach((item: string) => {
      if (typeof item == 'string') behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
    else if (typeof component.breed_items == 'string') behaviorpack_item_diagnose(minecraft_get_item(component.breed_items, diagnoser.document), diagnoser);
    if (typeof component.transform_to_item === 'string') behaviorpack_item_diagnose(minecraft_get_item(component.transform_to_item, diagnoser.document), diagnoser);
    if (component.require_tame && !diagnoser.document.getText().includes('minecraft:tameable')) diagnoser.add(name + '/require_tame',
      "This entity cannot be tamed despite being tamed set as a requirement for breeding",
      DiagnosticSeverity.info,
      "behaviorpack.entity.components.breedable"
    )
    minecraft_diagnose_filters(component.love_filters, diagnoser)
    processEntries(component.environment_requirements, (entry: any) => {
      if (typeof entry.blocks === 'string') behaviorpack_check_blockid(entry.blocks, diagnoser);
    });
    processEntries(component.breeds_with, (entry: any) => {
      if (typeof entry.baby_type === 'string') behaviorpack_entityid_diagnose(entry.baby_type, diagnoser);
      if (typeof entry.mate_type === 'string') behaviorpack_entityid_diagnose(entry.mate_type, diagnoser);
      minecraft_diagnose_filters(entry?.breed_event?.filters, diagnoser);
    });
    //TODO: minecraft:breedable/property_inheritance
  },
  "minecraft:bribeable": (name, component, context, diagnoser) => {
    component.bribe_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:buoyant": (name, component, context, diagnoser) => {
    component.liquid_blocks?.forEach((block: string) => {
      if (typeof block == 'string') behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:celebrate_hunt": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.celeberation_targets, diagnoser)
  },
  "minecraft:damage_sensor": (name, component, context, diagnoser) => {
    processEntries(component.triggers, entry => {
      minecraft_diagnose_filters(entry.on_damage?.filters, diagnoser)
    })
  },
  "minecraft:despawn": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:drying_out_timer": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.dried_out_event?.filters, diagnoser)
    minecraft_diagnose_filters(component.recover_after_dried_out_event?.filters, diagnoser)
    minecraft_diagnose_filters(component.stopped_drying_out_event?.filters, diagnoser)
  },
  "minecraft:economy_trade_table": check_trade_table,
  "minecraft:entity_sensor": (name, component, context, diagnoser) => {
    if (component.subsensors === undefined) return;
    try {
      const version = FormatVersion.parse(context.source.format_version);
      if (version[0] < 1 || (version[0] === 1 && version[1] < 21) || (version[0] === 1 && version[1] === 21 && version[2] < 0)) diagnoser.add(name,
        `To use "minecraft:entity_sensor/subsensors", you need a "format_version" of 1.21.0 or higher`,
        DiagnosticSeverity.error,
        'behaviorpack.entity.component.entity_sensor')
      minecraft_diagnose_filters(component.subsensors.event_filters, diagnoser)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Leaving this empty as the base diagnoser should already flag an invalid format version
    }
  },
  "minecraft:environment_sensor": (name, component, context, diagnoser) => {
    processEntries(component.triggers, entry => {
      minecraft_diagnose_filters(entry.filters, diagnoser)
    })
  },
  "minecraft:equip_item": (name, component, context, diagnoser) => {
    component.excluded_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:equippable": (name, component, context, diagnoser) => {
    component.slots?.forEach((slot: any) => {
      slot.accepted_items?.forEach((item: string) => {
        behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
      });
      minecraft_diagnose_filters(slot.on_equip?.filters, diagnoser)
      minecraft_diagnose_filters(slot.on_unequip?.filters, diagnoser)
    });
  },
  "minecraft:giveable": (name, component, context, diagnoser) => {
    component.items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
    minecraft_diagnose_filters(component.on_give?.filters, diagnoser)
  },
  "minecraft:healable": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
    component.items?.forEach((item: string | any) => {
      if (typeof item == 'string') behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
      else if (typeof item.item == 'string') behaviorpack_item_diagnose(minecraft_get_item(item.item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:home": (name, component, context, diagnoser) => {
    component.home_block_list?.forEach((block: string) => {
      behaviorpack_check_blockid(block, diagnoser);
    });
  },
  "minecraft:inside_block_notifier": (name, component, context, diagnoser) => {
    component.block_list?.forEach((entry: any) => {
      if (typeof entry.block == 'string') behaviorpack_check_blockid(entry.block, diagnoser);
      else if (typeof entry.block.name == 'string') behaviorpack_check_blockid(entry.block.name, diagnoser);
    });
  },
  "minecraft:interact": (name, component, context, diagnoser) => {
    component.interactions.forEach((entry: any) => {
      minecraft_diagnose_filters(component.on_interact?.filters, diagnoser)
      if (typeof entry.add_items?.table == 'string') behaviorpack_loot_table_diagnose(entry.add_items.table, diagnoser)
      if (typeof entry.spawn_items?.table == 'string') behaviorpack_loot_table_diagnose(entry.spawn_items.table, diagnoser)
      if (typeof entry.spawn_entities == 'string') behaviorpack_entityid_diagnose(entry.spawn_entities, diagnoser)
      else if (Array.isArray(entry.spawn_entities)) entry.spawn_entities.forEach((id: string) => {
        if (typeof id == 'string') behaviorpack_entityid_diagnose(id, diagnoser)
      });
      if (typeof component.transform_to_item === 'string') behaviorpack_item_diagnose(minecraft_get_item(component.transform_to_item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:leashable": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_leash?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_unleash?.filters, diagnoser)
  },
  "minecraft:looked_at": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
    minecraft_diagnose_filters(component.looked_at_event?.filters, diagnoser)
    minecraft_diagnose_filters(component.not_looked_at_event?.filters, diagnoser)
  },
  "minecraft:mob_effect": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.entity_filter, diagnoser)
  },
  "minecraft:nameable": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.default_trigger?.filters, diagnoser)
    component.name_actions?.forEach((entry: any) => {
      minecraft_diagnose_filters(entry.on_named?.filters, diagnoser)
    });
  },
  "minecraft:peek": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_close?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_open?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_target_open?.filters, diagnoser)
  },
  "minecraft:preferred_path": (name, component, context, diagnoser) => {
    component.preferred_path_blocks?.forEach((entry: any) => {
      entry.blocks.forEach((id: string) => {
        if (typeof id == 'string') behaviorpack_check_blockid(id, diagnoser);
      });
    });
  },
  "minecraft:projectile": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_hit?.definition_event?.event_trigger?.filters, diagnoser)
    if (typeof component.on_hit?.spawn_chance?.spawn_definition == 'string') behaviorpack_entityid_diagnose(component.on_hit.spawn_chance.spawn_definition, diagnoser)
   },
  "minecraft:rail_sensor": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_activate?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_deactivate?.filters, diagnoser)
  },
  "minecraft:ravager_blocked": (name, component, context, diagnoser) => {
    component.reaction_choices?.forEach((entry: any) => {
      minecraft_diagnose_filters(entry.value?.filters, diagnoser)
    });
  },
  "minecraft:rideable": (name, component, context, diagnoser) => {
    component.family_types?.forEach((family: string) => {
      minecraft_family_diagnose(family, diagnoser)
    });
  },
  "minecraft:scheduler": (name, component, context, diagnoser) => {
    component.scheduled_events?.forEach((entry: any) => {
      minecraft_diagnose_filters(entry.filters, diagnoser)
    });
  },
  "minecraft:shareables": (name, component, context, diagnoser) => {
    component.items?.forEach((entry: any) => {
      behaviorpack_item_diagnose(minecraft_get_item(entry.item, diagnoser.document), diagnoser);
      if (entry.craft_into) behaviorpack_item_diagnose(minecraft_get_item(entry.craft_into, diagnoser.document), diagnoser);
      // TODO: Check if entry.barter and then check for barter components
      // TODO: Check if entry.admire and then check for admire components
    });
  },
  "minecraft:shooter": (name, component, context, diagnoser) => {
    behaviorpack_entityid_diagnose(component.def, diagnoser)
    component.projectiles?.forEach((entry: any) => {
      behaviorpack_entityid_diagnose(entry.def, diagnoser)
    });
  },
  "minecraft:sittable": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.sit_event?.filters, diagnoser)
    minecraft_diagnose_filters(component.stand_event?.filters, diagnoser)
  },
  "minecraft:spawn_entity": (name, component, context, diagnoser) => {
    processEntries(component.entities, (entry) => {
      minecraft_diagnose_filters(entry.filters, diagnoser)
      minecraft_diagnose_filters(entry.spawn_item_event?.filters, diagnoser)
      if (entry.spawn_item) behaviorpack_item_diagnose(minecraft_get_item(entry.spawn_item, diagnoser.document), diagnoser);
      if (!entry.spawn_entity) return;
      behaviorpack_entityid_diagnose(entry.spawn_entity, diagnoser)
      if (entry.spawn_event && !diagnoser.context.getCache().behaviorPacks.entities.get(entry.spawn_entity)?.events.includes(entry.spawn_event)) diagnoser.add(name,
        `Trying to call event "${entry.spawn_event}" that does not exist on "${entry.spawn_entity}"`,
        DiagnosticSeverity.warning,
        `behaviorpack.entity.component.spawn_entity`
      )
    })
  },
  "minecraft:tameable": (name, component, context, diagnoser) => {
    component.tame_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
    minecraft_diagnose_filters(component.tame_event?.filters, diagnoser)
  },
  "minecraft:tamemount": (name, component, context, diagnoser) => {
    component.auto_reject_items?.forEach((entry: any) => {
      behaviorpack_item_diagnose(minecraft_get_item(entry.item, diagnoser.document), diagnoser);
    });
    component.feed_items?.forEach((entry: any) => {
      behaviorpack_item_diagnose(minecraft_get_item(entry.item, diagnoser.document), diagnoser);
    });
    minecraft_diagnose_filters(component.tame_event?.filters, diagnoser)
  },
  "minecraft:target_nearby_sensor": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.on_inside_range?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_outside_range?.filters, diagnoser)
    minecraft_diagnose_filters(component.on_vision_lost_inside_range?.filters, diagnoser)
  },
  "minecraft:timer": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.time_down_event?.filters, diagnoser)
    if (component.time && component.random_time_choices) diagnoser.add(name,
      `"time" & "random_time_choices" are incompatible with each other`,
      DiagnosticSeverity.error,
      `behaviorpack.entity.component.timer`
    )
  },
  "minecraft:trade_table": check_trade_table,
  "minecraft:trail": (name, component, context, diagnoser) => {
    if (component.block_type) behaviorpack_check_blockid(component.block_type, diagnoser);
    minecraft_diagnose_filters(component.spawn_filter, diagnoser)
  },
  "minecraft:transformation": (name, component, context, diagnoser) => {
    diagnose_resourcepack_sound(component.begin_transform_sound, diagnoser)
    diagnose_resourcepack_sound(component.transformation_sound, diagnoser)
    if (component.into) behaviorpack_entityid_diagnose(component.into, diagnoser)
  },
  "minecraft:trusting": (name, component, context, diagnoser) => {
    component.trust_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
    minecraft_diagnose_filters(component.trust_event?.filters, diagnoser)
  },
  "minecraft:equipment": check_loot_table,
  "minecraft:ignore_cannot_be_attacked": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:item_controllable": (name, component, context, diagnoser) => {
    component.control_items?.forEach((item: string) => {
      behaviorpack_item_diagnose(minecraft_get_item(item, diagnoser.document), diagnoser);
    });
  },
  "minecraft:loot": check_loot_table,
  "minecraft:on_death": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_friendly_anger": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_hurt": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_hurt_by_player": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_ignite": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_start_landing": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:on_start_takeoff": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
    canOnlyBeUsedBySpecificMob(context.source, 'minecraft:ender_dragon')
  },
  "minecraft:on_target_acquired": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_target_escape": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:on_wake_with_owner": (name, component, context, diagnoser) => {
    minecraft_diagnose_filters(component.filters, diagnoser)
  },
  "minecraft:input_air_controlled": (name, component, context, diagnoser) => {
    if (!(context.source as any).use_beta_features) diagnoser.add(name,
      `This component requires "use_beta_features" to be set to true`,
      DiagnosticSeverity.error,
      `behaviorpack.entity.component.requires_beta_features`
    )
  },
  "minecraft:fall_damage": (name, component, context, diagnoser) => {
    try {
      const version = FormatVersion.parse(context.source.format_version);
      if (version[0] > 1 || (version[0] === 1 && version[1] > 10) || (version[0] === 1 && version[1] === 10 && version[2] > 0)) diagnoser.add(name,
        `To use "minecraft:fall_damage", you need a "format_version" of 1.10.0 or lesser`,
        DiagnosticSeverity.error,
        'behaviorpack.entity.component.fall_damage')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Leaving this empty as the base diagnoser should already flag an invalid format version
    }
  }
};

function canOnlyBeUsedBySpecificMob(source: any, id: string | string[]) {
  if (typeof id == 'string' && (source['minecraft:entity']?.description?.identifier == id || source['minecraft:entity']?.description?.runtime_identifier == id)) return;
  if (typeof id == 'object' && (id.includes(source['minecraft:entity']?.description?.identifier) || id.includes(source['minecraft:entity']?.description?.runtime_identifier))) return;
  return component_error(
    "This component can only be used by '" + id + "'",
    "behaviorpack.entity.components." + (typeof id == 'string' ? id.slice(10) : id.map(x => x.slice(10)).join(', ')) + '_component'
  );
}

function processEntries<T>(data: T | T[], callback: (entry: T) => void) {
  if (Array.isArray(data)) data.forEach(callback);
  else if (data) callback(data);
}
