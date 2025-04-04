import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from '../../../../Types';
import { Json } from "../../../Json/Json";

/**Diagnoses the given document as an tick.json
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  const data = Json.LoadReport<Tick>(diagnoser);
  if (!data || !data.values) return;

  const pack = diagnoser.context.getCache().behaviorPacks.get(diagnoser.document.uri);
  if (!pack) return;

  //Specific lookup in the pack
  data.values?.forEach((path) => {
    if (!pack.functions.has(path)) {
      diagnoser.add(
        path,
        "Cannot find mcfunction: " + path,
        DiagnosticSeverity.error,
        "behaviorpack.mcfunction.missing"
      );
    }
  });
}

/** */
interface Tick {
  values?: string[];
}
