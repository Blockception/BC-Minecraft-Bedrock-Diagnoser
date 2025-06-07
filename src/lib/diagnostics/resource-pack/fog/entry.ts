/* eslint-disable @typescript-eslint/no-unused-vars */
import { Internal } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json";

/**Diagnoses the given document as a fog
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function diagnose_fog_document(diagnoser: DocumentDiagnosticsBuilder): void {
  //TODO add rp diagnostics
  const entity = Json.LoadReport<Internal.ResourcePack.Fog>(diagnoser);
  if (!Internal.ResourcePack.Fog.is(entity)) return;
}
