import { TextDocument } from "bc-minecraft-bedrock-project";
import { jsonc } from "jsonc";
import { DiagnosticsBuilder, DocumentDiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { Handle_Json_Error } from "./Errors";

export namespace Json {
  /**Loads the object and casts it to the specified type, if it fails then undefined is loaded and the error message is send to the diagnoser
   * @param doc The text document to load from
   * @param diagnoser The diagnoser to load from
   * @returns Either the object cast to the specific type, or undefined if failed*/
  export function LoadReport<T>(diagnoser: DocumentDiagnosticsBuilder): T | undefined {
    try {
      //get text
      const text = diagnoser.document.getText();

      //get object
      const temp = parse(text);
      return temp as T;

      //cast object
    } catch (err: any) {
      Handle_Json_Error(err, diagnoser);
    }

    return undefined;
  }

  export function parse(text: string): any {
    return jsonc.parse(text, { stripComments: true });
  }

  /**
   *
   * @param value
   * @param diagnoser
   * @param type
   * @param code
   * @param checkFn
   * @returns
   */
  export function TypeCheck<T>(
    value: any,
    diagnoser: DiagnosticsBuilder,
    type: string,
    code: string,
    checkFn: (value: any) => value is T
  ): value is T {
    if (checkFn(value)) {
      return true;
    }

    diagnoser.Add(0, "Json cannot be casted to: " + type, DiagnosticSeverity.error, code);
    return false;
  }
}
