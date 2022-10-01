import { behaviorpack_entity_components_economy_trade_table } from "./components/economy_trade_table";
import { behaviorpack_entity_components_loot } from "./components/loot";
import { behaviorpack_entity_components_trade_table } from "./components/trade";
import { DiagnosticsBuilder } from "../../../Types";
import { Internal } from "bc-minecraft-bedrock-project";
import { behaviorpack_diagnose_entity_components } from "./components/diagnose";
import { Context } from "./components/context";
import { behaviorpack_entity_components_filters } from "./components/filters";

export function behaviorpack_entity_components_check(
  entity: Internal.BehaviorPack.Entity,
  context: Context,
  diagnoser: DiagnosticsBuilder
) {
  const desc = entity["minecraft:entity"];

  behaviorpack_entity_componentscontainer_check(desc.components, context, diagnoser);

  if (desc.component_groups === undefined) return;

  const groups = Object.getOwnPropertyNames(desc.component_groups);

  for (let I = 0; I < groups.length; I++) {
    const group = groups[I];
    behaviorpack_entity_componentscontainer_check(desc.component_groups[group], context, diagnoser);
  }
}

function behaviorpack_entity_componentscontainer_check(
  container: Internal.BehaviorPack.EntityComponentContainer | undefined | null,
  context: Context,
  diagnoser: DiagnosticsBuilder
) {
  if (container === null || typeof container !== "object") return;

  behaviorpack_entity_components_loot(container, diagnoser);
  behaviorpack_entity_components_trade_table(container, diagnoser);
  behaviorpack_entity_components_economy_trade_table(container, diagnoser);
  behaviorpack_entity_components_filters(container, diagnoser);

  behaviorpack_diagnose_entity_components(container, context, diagnoser);
}
