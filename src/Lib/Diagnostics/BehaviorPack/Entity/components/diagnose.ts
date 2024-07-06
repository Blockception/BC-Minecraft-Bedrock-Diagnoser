import { check_loot_table } from "./loot";
import { check_trade_table } from "./trade";
import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/src/minecraft/components";
import { ComponentCheck, components_check } from "../../../../utility/components/checks";
import { Context } from "../../../../utility/components";
import { DiagnosticsBuilder } from "../../../../Types";
import { behaviorpack_entity_components_filters } from './filters';

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_entity_components(
  container: ComponentBehavior,
  context: Context,
  diagnoser: DiagnosticsBuilder
): void {
  components_check(container, context, diagnoser, component_test);

  behaviorpack_entity_components_filters(container, diagnoser);
}

const component_test: Record<string, ComponentCheck> = {
  "minecraft:economy_trade_table": check_trade_table,
  "minecraft:equipment": check_loot_table,
  "minecraft:loot": check_loot_table,
  "minecraft:trade_table": check_trade_table,
};
