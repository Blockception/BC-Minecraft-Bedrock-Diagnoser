import { TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity } from "../../../../main";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { mcfunction_commandscheck } from "./commands";

/**Diagnoses the given document as an mcfunction
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  if (doc.getText().trim() === "") {
    diagnoser.Add(0, "Empty mcfunction found, minecraft will not load this function", DiagnosticSeverity.error, "mcfunction.empty");
  }

  mcfunction_commandscheck(doc, diagnoser);
}
