import { TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { diagnose_molang } from '../../Molang/diagnostics';

/**Diagnoses the given document as a block
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //TODO add rp diagnostics
    
  //Check molang
  diagnose_molang(doc.getText(), "block", diagnoser);
}
