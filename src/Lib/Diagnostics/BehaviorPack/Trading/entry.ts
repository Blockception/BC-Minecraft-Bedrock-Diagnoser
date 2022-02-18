import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from '../../Json/Json';
import { behaviorpack_loot_table_function_diagnose, LootFunction } from '../Loot Table/functions';
import { TextDocument } from "bc-minecraft-bedrock-project";
import { Types } from 'bc-minecraft-bedrock-types';
import { behaviorpack_item_diagnose } from '../Item/diagnose';

/**Diagnoses the given document as an trading table
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const table = Json.LoadReport<TradeTable>(doc, diagnoser);
  if (typeof table !== "object") return;

  //Foreach tier
  table.tiers?.forEach(tier=>{
    //Foreach group in tier
    tier.groups?.forEach(group=>{
      //Foreach trade in group
      group.trades?.forEach(trade=>{
        //Foreach gives in group
        trade.gives?.forEach(item=>diagnose_item(item, doc, diagnoser));
        //Foreach want in group
        trade.wants?.forEach(item=>diagnose_item(item, doc, diagnoser));
      });
    });
  });
}

function diagnose_item(entry : TradeGive, doc: TextDocument, diagnoser : DiagnosticsBuilder) : void {
  //Is item then check if item exists
  let item = entry.item ?? "";
  let index = doc.getText().indexOf(item);

  behaviorpack_item_diagnose(Types.OffsetWord.create(item, index), diagnoser);

  entry.functions?.forEach(fn=>behaviorpack_loot_table_function_diagnose(fn, diagnoser));
}

interface TradeTable {
  tiers?: TradeTier[];
}

interface TradeTier {
  total_exp_required?: number;
  groups?:TradeGroup[];
}

interface TradeGroup {
  num_to_select?:number
  trades?:TradeTrades[];
}

interface TradeTrades {
  trader_exp?: number,
  max_uses?: number,
  reward_exp?: number
  wants?:TradeWant[];
  gives?:TradeGive[];
}

interface TradeWant {
  item?:string
  quantity?:number,
}

interface TradeGive {
  item?:string
  quantity?:number,
  functions?:LootFunction[],
}