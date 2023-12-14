import { DocumentDiagnosticsBuilder } from "../../../Types";
import { diagnose_molang } from '../../Molang/diagnostics';

/**Diagnoses the given document as a particle
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Particles", diagnoser);

  //TODO add rp diagnostics
}
