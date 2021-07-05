import { DiagnosticSeverity } from "./Severity";
import { Position, JsonPath, TextDocument, ProjectData } from "bc-minecraft-bedrock-project";
import { MCIgnore, MCProject } from "bc-minecraft-project";

/**
 *
 */
export interface DiagnosticsBuilder {
  /**
   *
   */
  context: DiagnosticsBuilderContent;

  /**
   *
   */
  project: MCProject;

  /**Adds the diagnostics following message to the specified location in the document.
   * @param position The position in the document to add this message to
   * @param message The message to add
   * @param severity The severity of the issue
   * @param code The code of the diagnostic error*/
  Add(position: Position | JsonPath | number, message: string, severity: DiagnosticSeverity, code: string | number): void;
}

/**
 *
 */
export interface DiagnosticsBuilderContent {
  /** */
  getDocument(uri: string): TextDocument | undefined;

  /** */
  getFiles(folder: string, ignores: MCIgnore): string[];

  /** */
  cache: ProjectData;
}
