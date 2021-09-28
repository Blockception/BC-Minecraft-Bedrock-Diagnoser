import { DiagnosticsBuilder, DiagnosticSeverity } from '../../Types/DiagnosticsBuilder/include';
import { Types} from 'bc-minecraft-bedrock-types';
import { check_definition_value } from '../Definitions';


export function minecraft_item_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  const id = value.text;
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.item, id, diagnoser)) return true;

  const data = diagnoser.context.getCache();

  //Project has item
  if (data.BehaviorPacks.items.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(value, `Cannot behaviorpack item: ${id}`, DiagnosticSeverity.error, "behaviorpack.item.missing");
  return false;
}
