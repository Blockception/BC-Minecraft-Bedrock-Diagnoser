import { TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from '../../../../Types/Severity';
import { Json } from '../../../Json/Json';

/**Diagnoses the given document as an tick.json
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const data = Json.LoadReport<Tick>(doc, diagnoser);
  if (!data || !data.values) return;

  const pack = diagnoser.context.getCache().BehaviorPacks.get(doc);
  if (!pack) return;

  //Specific lookup in the pack
  data.values?.forEach(path => {
    if (!pack.functions.has(path)) {
      diagnoser.Add(path, "Cannot find mcfunction: " + path, DiagnosticSeverity.error, "behaviorpack.mcfunction.missing");
    }
  })
}

/** */
interface Tick {
  values?: string[]
}