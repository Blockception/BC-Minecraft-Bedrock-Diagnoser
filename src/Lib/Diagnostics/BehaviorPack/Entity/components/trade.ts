import { DiagnosticsBuilder } from "../../../../Types";
import { behaviorpack_trading_diagnose } from "../../Trading/diagnose";
import { Context } from '../../../../utility/components';

export function check_trade_table<T>(_name: string, component: any, _context: Context<T>, diagnoser: DiagnosticsBuilder): void {
  if (component === undefined) return;
  if (typeof component.table !== "string") return;
  const table = component.table;

  behaviorpack_trading_diagnose(table, diagnoser);
}
