import { DiagnosticSeverity } from "../../../../main";
import { DocumentDiagnosticsBuilder } from "../../../Types";
import { mcfunction_commandsCheck } from "./commands";

/**Diagnoses the given document as an mcfunction
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  if (diagnoser.document.getText().trim() === "") {
    diagnoser.add(
      0,
      "Empty mcfunction found, minecraft will not load this function",
      DiagnosticSeverity.error,
      "behaviorpack.mcfunction.empty"
    );
  }

  mcfunction_commandsCheck(diagnoser);
}
