import { TextDocument } from "bc-minecraft-bedrock-project";
import { jsonc } from "jsonc";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { Handle_Json_Error } from "./Errors";

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
    } catch (err: any) {
      Handle_Json_Error(err, doc, diagnoser);
    }

    return out;
  }

  /**
   *
   * @param value
   * @param diagnoser
   * @param type
   * @param code
   * @param checkfn
   * @returns
   */
  export function TypeCheck<T>(
    value: any,
    diagnoser: DiagnosticsBuilder,
    type: string,
    code: string,
    checkfn: (value: any) => value is T
  ): value is T {
    if (checkfn(value)) {
      return true;
    }

    diagnoser.Add(0, "Json cannot be casted to: " + type, DiagnosticSeverity.error, code);
    return false;
  }
}
