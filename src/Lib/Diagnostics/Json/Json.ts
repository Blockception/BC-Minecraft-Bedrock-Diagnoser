import { TextDocument } from "bc-minecraft-bedrock-project";
import { jsonc } from "jsonc";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

export namespace Json {
  /**Loads the object and casts it to the specified type, if it fails then undefined is loaded and the error message is send to the diagnoser
   * @param doc The text document to load from
   * @param diagnoser The diagnoser to load from
   * @returns Either the object cast to the specific type, or undefined if failed*/
  export function LoadReport<T>(doc: TextDocument, diagnoser: DiagnosticsBuilder): T | undefined {
    let out: T | undefined = undefined;

    try {
      //get text
      const text = doc.getText();

      //get object
      const temp = jsonc.parse(text, { stripComments: true });

      //cast object
      out = <T>temp;
    } catch (err : any) {
      if (err.message && err.stack) {
        diagnoser.Add(0, err.message + "\n" + err.stack, DiagnosticSeverity.error, "json.invalid");
      }
      else {
        //add parsing of error to possible retrieve the position of the error?
        diagnoser.Add(0, `Invalid json: ${JSON.stringify(err)}`, DiagnosticSeverity.error, "json.invalid");
      }
      
    }

    return out;
  }
}
