
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types/DiagnosticsBuilder/include';
import { OffsetWord } from "../../../Types/OffsetWord";
import { check_definition_value } from '../../Definitions';

export function behaviorpack_loot_table_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  const id = value.text;
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.loot_table, id, diagnoser)) return true;

  const data = diagnoser.context.getCache();

  //Project has loot_table
  if (data.BehaviorPacks.loot_tables.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(`"${id}"`, `Cannot find behaviorpack loot_table definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.loot_table.missing");
  return false;
}
