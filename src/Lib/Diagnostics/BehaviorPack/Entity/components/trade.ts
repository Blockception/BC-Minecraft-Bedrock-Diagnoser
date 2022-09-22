import { DiagnosticsBuilder } from "../../../../Types";
import { Internal } from "bc-minecraft-bedrock-project";
import { behaviorpack_trading_diagnose } from "../../Trading/diagnose";

export function behaviorpack_entity_components_trade_table(
  container: Internal.BehaviorPack.EntityComponentContainer,
  diagnoser: DiagnosticsBuilder
) {
  const loot = container["minecraft:trade_table"];

  if (loot === undefined) return;
  if (typeof loot.table !== "string") return;

  const table = <string>loot.table;

  behaviorpack_trading_diagnose(table, diagnoser);
}
