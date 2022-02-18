import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { behaviorpack_entityid_diagnose } from '../Entity/diagnose';

/**
 *
 */
export interface LootCondition {
  /** */
  condition: string;
}

/**
 *
 * @param value
 * @param diagnoser
 */
export function behaviorpack_loot_table_condition_diagnose(
  value: LootCondition,
  diagnoser: DiagnosticsBuilder
): void {


}
