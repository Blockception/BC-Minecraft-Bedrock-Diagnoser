import { TextDocument } from "bc-minecraft-bedrock-project";
import { Types } from 'bc-minecraft-bedrock-types';
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from '../../Json/Json';
import { behaviorpack_item_diagnose } from '../Item/diagnose';

/**Diagnoses the given document as an loot table
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const table = Json.LoadReport<LootTable>(doc, diagnoser);

  if (typeof table !== "object") return;

  table.pools?.forEach(pool => {
    pool.entries?.forEach(entry => {
      //Is item then check if item exists
      if (entry.type === "item") {
        const item = entry.name ?? "";
        const index = doc.getText().indexOf(item);

        behaviorpack_item_diagnose(Types.OffsetWord.create(item, index), diagnoser);
      }
    });
  });
}


interface LootTable {
  pools?: LootPool[];
}

interface LootPool {
  rolls? : number;
  entries?: LootEntry[];
}

interface LootEntry {
  type?: string;
  name?: string;
}