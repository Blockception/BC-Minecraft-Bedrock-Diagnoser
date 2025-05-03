import { DocumentDiagnosticsBuilder} from "../../../types";
import { Internal } from "bc-minecraft-bedrock-project";
import { Json } from '../../json';

/**Diagnoses the given document as a model
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Load model
  const model = Json.LoadReport<Internal.ResourcePack.Model>(diagnoser);
  if (!Internal.ResourcePack.Model.is(model)) return;

  
}
