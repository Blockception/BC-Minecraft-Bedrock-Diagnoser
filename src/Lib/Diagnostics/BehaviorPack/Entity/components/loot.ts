import { DiagnosticsBuilder } from "../../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { behaviorpack_loot_table_diagnose } from "../../Loot Table/diagnose";

export function behaviorpack_entity_components_loot(container: Internal.BehaviorPack.EntityComponentContainer, diagnoser: DiagnosticsBuilder) {
  const loot = container["minecraft:loot"];

  if (loot === undefined) return;
  if (typeof loot.table !== "string") return;

  const table = <string>loot.table;

  behaviorpack_loot_table_diagnose(table, diagnoser);
}
