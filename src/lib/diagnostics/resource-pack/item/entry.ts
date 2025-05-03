import { DocumentDiagnosticsBuilder} from "../../../types";
import { diagnose_molang } from '../../molang/diagnostics';

/**Diagnoses the given document as an rp item
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //TODO add rp diagnostics
  
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Entities", diagnoser);
}
