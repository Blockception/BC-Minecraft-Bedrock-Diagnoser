import { TextDocument } from "bc-minecraft-bedrock-project";
import { MCProject } from "bc-minecraft-project";
import { DiagnosticsBuilder, DiagnosticsBuilderContent } from "../DiagnosticsBuilder/DiagnosticsBuilder";

/**
 *
 */
export interface DiagnoserContext extends DiagnosticsBuilderContent {
  /**
   *
   * @param doc
   */
  getDiagnoser(doc: TextDocument, project: MCProject): InternalDiagnosticsBuilder | undefined;
}

/**
 *
 */
export interface InternalDiagnosticsBuilder extends DiagnosticsBuilder {
  /**Marks that this builder is done*/
  done(): void;
}
