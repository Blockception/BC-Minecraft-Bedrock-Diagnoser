import { Text } from 'bc-minecraft-bedrock-project';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types/DiagnosticsBuilder/include';
import { OffsetWord } from '../../../Types/OffsetWord';
import { check_definition_value } from '../../Definitions';

export function behaviorpack_functions_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder) : boolean {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //Check project
  if (check_definition_value(diagnoser.project.definitions.function, id, diagnoser)) return true;

  //If project has function then ignore
  if (data.BehaviorPacks.functions.has(id)) return true;

  diagnoser.Add(value.offset, `Cannot find mcfunction: ${id}`, DiagnosticSeverity.error, "behaviorpack.function.missing");
  return false;
}
