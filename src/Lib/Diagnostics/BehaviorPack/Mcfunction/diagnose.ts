import { Text } from 'bc-minecraft-bedrock-project';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types/DiagnosticsBuilder/include';
import { OffsetWord } from '../../../Types/OffsetWord';

export function behaviorpack_functions_diagnose(value: OffsetWord, diagnoser: DiagnosticsBuilder) : boolean {
  const data = diagnoser.context.getCache();
  const id = Text.UnQuote(value.text);

  //If project has function then ignore
  if (data.BehaviorPacks.functions.has(id)) return true;

  diagnoser.Add(value.offset, `Cannot find mcfunction: ${id}`, DiagnosticSeverity.error, "behaviorpack.function.missing");
  return false;
}
