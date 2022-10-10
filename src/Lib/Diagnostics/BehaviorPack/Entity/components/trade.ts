import { DiagnosticsBuilder } from "../../../../Types";
import { behaviorpack_trading_diagnose } from "../../Trading/diagnose";
import { Context } from '../../../../Utility/components';

export function check_trade_table(name: string, component: any, context: Context, diagnoser: DiagnosticsBuilder): void {
  if (component === undefined) return;
  if (typeof component.table !== "string") return;
  const table = component.table;

  behaviorpack_trading_diagnose(table, diagnoser);
}
