import { TextDocument } from "bc-minecraft-bedrock-project";
import { MCProject } from "bc-minecraft-project";
import { DiagnosticsBuilder, DiagnosticsBuilderContent } from "../DiagnosticsBuilder/DiagnosticsBuilder";

/**The context needed for the Diagnoser*/
export interface DiagnoserContext extends DiagnosticsBuilderContent {
  /**Creates / Get a diagnoser for the specified textdocument and project settings, return undefined if there is an error
   * @param doc The textdocument object to process
   * @param project The project settings related to the textdocument*/
  getDiagnoser(doc: TextDocument, project: MCProject): InternalDiagnosticsBuilder | undefined;
}

/**A interface object for between the Diagnoser and the code users, used to mark off if the diagnoser is done with its work on the document*/
export interface InternalDiagnosticsBuilder extends DiagnosticsBuilder {
  /**Marks that this builder is done*/
  done(): void;
}

/**
 *
 */
export namespace DiagnoserContext {
  /**
   *
   * @param value
   */
  export function is(value: any): value is DiagnoserContext {
    if (typeof value === "object") {
      if (value.getDiagnoser) return true;
    }

    return false;
  }
}

/**
 *
 */
export namespace InternalDiagnosticsBuilder {
  /**
   *
   * @param value
   */
  export function is(value: any): value is InternalDiagnosticsBuilder {
    if (typeof value === "object") {
      if (value.done) return true;
    }

    return false;
  }
}
