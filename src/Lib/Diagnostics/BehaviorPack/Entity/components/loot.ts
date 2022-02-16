import { DiagnosticsBuilder } from "../../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Internal } from "bc-minecraft-bedrock-project";
import { behaviorpack_loot_table_diagnose } from "../../Loot Table/diagnose";

export function behaviorpack_entity_components_loot(
  container: Internal.BehaviorPack.EntityComponentContainer,
  diagnoser: DiagnosticsBuilder
) {
  checkitem(container["minecraft:loot"], diagnoser);
  checkitem(container["minecraft:equipment"], diagnoser);
}

function checkitem( component: { table?: string } | undefined, diagnoser: DiagnosticsBuilder): void {
  if (component === undefined) return;
  if (typeof component.table !== "string") return;
  const table = component.table;
  behaviorpack_loot_table_diagnose(table, diagnoser);
}
