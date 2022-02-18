import { TextDocument } from "bc-minecraft-bedrock-project";
import { Types } from 'bc-minecraft-bedrock-types';
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from '../../Json/Json';
import { behaviorpack_item_diagnose } from '../Item/diagnose';
import { behaviorpack_loot_table_diagnose } from './diagnose';
import { behaviorpack_loot_table_function_diagnose, LootFunction } from './functions';
import { behaviorpack_loot_table_condition_diagnose, LootCondition } from './conditions';

/**Diagnoses the given document as an loot table
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const table = Json.LoadReport<LootTable>(doc, diagnoser);
  if (typeof table !== "object") return;

  table.pools?.forEach(pool => {
    pool.entries?.forEach(entry => {
      //Is item then check if item exists
      let item : string;
      let index : number;

      switch (entry.type) {
        case 'item':
          item = entry.name ?? "";
          index = doc.getText().indexOf(item);
  
          behaviorpack_item_diagnose(Types.OffsetWord.create(item, index), diagnoser);
          break;

        case 'loot_table':
          item = entry.name ?? "";
          index = doc.getText().indexOf(item);
  
          behaviorpack_loot_table_diagnose(Types.OffsetWord.create(item, index), diagnoser);
          break;
      }

      //Loop over functions
      entry.functions?.forEach(fn=>behaviorpack_loot_table_function_diagnose(fn, diagnoser));
    });
  });
}


interface LootTable {
  pools?: LootPool[];
}

interface LootPool {
  rolls? : number;
  entries?: LootEntry[];
  condition?: LootCondition[];
}

interface LootEntry {
  type?: string;
  name?: string;
  weight?: number;
  functions?: LootFunction[];
}

