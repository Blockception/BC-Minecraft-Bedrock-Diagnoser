/* eslint-disable @typescript-eslint/no-unused-vars */
import { Internal } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json";

export function diagnose_block_culling_document(diagnoser: DocumentDiagnosticsBuilder): void {
  const rules = Json.LoadReport<Internal.ResourcePack.BlockCulling>(diagnoser);
  if (!Internal.ResourcePack.BlockCulling.is(rules)) return;

  // TODO check block_culling document
}
