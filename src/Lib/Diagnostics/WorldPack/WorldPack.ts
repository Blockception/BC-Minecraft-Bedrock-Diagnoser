import { DocumentDiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";

import * as Manifest from "./Manifest/entry";

/** The namespace that deals with worldpack diagnostics */
export namespace WorldPack {
  /**Processes and diagnoses the given textdocument
   * @param doc The document to process / diagnose
   * @param diagnoser The diagnoser to report to
   * @returns `true` or `false` whenever or not it was succesfull*/
  export function Process(diagnoser: DocumentDiagnosticsBuilder): boolean {
    //retrieve filter doc type
    if (diagnoser.document.uri.endsWith("manifest.json")) {
      Manifest.Diagnose(diagnoser);
      return true;
    }

    return true;
  }
}
