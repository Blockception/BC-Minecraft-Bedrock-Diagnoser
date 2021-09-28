import { Text } from 'bc-minecraft-bedrock-project';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types/DiagnosticsBuilder/include';
import { Types} from 'bc-minecraft-bedrock-types';
import { check_definition_value } from '../../Definitions';

export function behaviorpack_functions_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder) : boolean {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //Check project
  if (check_definition_value(diagnoser.project.definitions.function, id, diagnoser)) return true;

  //If project has function then ignore
  if (data.BehaviorPacks.functions.has(id)) return true;

  diagnoser.Add(value.offset, `Cannot find mcfunction: ${id}`, DiagnosticSeverity.error, "behaviorpack.function.missing");
  return false;
}
