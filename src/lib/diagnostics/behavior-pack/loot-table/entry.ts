import { DocumentDiagnosticsBuilder} from "../../../types";
import { Json } from "../../json/json";
import { behaviorpack_item_diagnose } from "../item/diagnose";
import { behaviorpack_loot_table_diagnose } from "./diagnose";
import { behaviorpack_loot_table_function_diagnose, LootFunction } from "./functions";
import { LootCondition } from "./conditions";
import { minecraft_get_item } from "../../minecraft/Items";

/**Diagnoses the given document as an loot table
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  const table = Json.LoadReport<LootTable>(diagnoser);
  if (typeof table !== "object") return;

  table.pools?.forEach((pool) => {
    pool.entries?.forEach((entry) => {
      //Is item then check if item exists
      switch (entry.type) {
        case "item":
          if (entry.name) behaviorpack_item_diagnose(minecraft_get_item(entry.name, diagnoser.document), diagnoser);
          break;

        case "loot_table":
          if (entry.name) behaviorpack_loot_table_diagnose(minecraft_get_item(entry.name, diagnoser.document), diagnoser);
          break;
      }

      //Loop over functions
      entry.functions?.forEach((fn) => behaviorpack_loot_table_function_diagnose(fn, diagnoser));
    });
  });
}

interface LootTable {
  pools?: LootPool[];
}

interface LootPool {
  rolls?: number;
  entries?: LootEntry[];
  condition?: LootCondition[];
}

interface LootEntry {
  type?: string;
  name?: string;
  weight?: number;
  functions?: LootFunction[];
}
