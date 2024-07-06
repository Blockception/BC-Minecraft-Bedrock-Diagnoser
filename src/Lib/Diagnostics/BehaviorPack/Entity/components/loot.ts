import { behaviorpack_loot_table_diagnose } from "../../Loot Table/diagnose";
import { DiagnosticsBuilder } from "../../../../Types";
import { Context } from '../../../../utility/components';


export function check_loot_table(name: string, component: any, context: Context, diagnoser: DiagnosticsBuilder): void { 
  if (component === undefined) return;
  if (typeof component.table !== "string") return;
  const table = component.table;
  behaviorpack_loot_table_diagnose(table, diagnoser);
}
