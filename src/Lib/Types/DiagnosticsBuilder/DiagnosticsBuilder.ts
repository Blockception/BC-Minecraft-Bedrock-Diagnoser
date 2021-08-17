import { DiagnosticSeverity } from "./Severity";
import { TextDocument, ProjectData } from "bc-minecraft-bedrock-project";
import { MCIgnore, MCProject } from "bc-minecraft-project";
import { Types } from "bc-minecraft-bedrock-types";

/**The interface of a diagnostics builder*/
export interface DiagnosticsBuilder {
  /**The context of the given */
  context: DiagnosticsBuilderContent;

  /**The project settings for this given document*/
  project: MCProject;

  /**Adds the diagnostics following message to the specified location in the document.
   * @param position The position in the document to add this message to
   * @param message The message to add
   * @param severity The severity of the issue
   * @param code The code of the diagnostic error*/
  Add(position: Types.DocumentLocation, message: string, severity: DiagnosticSeverity, code: string | number): void;
}

/**The context of a diagnostics builder*/
export interface DiagnosticsBuilderContent {
  /**Returns a textdocument object or undefined if something went wrong or nothing exists*/
  getDocument(uri: string): TextDocument | undefined;

  /**Returns all files in the given directory and sub directories*/
  getFiles(folder: string, ignores: MCIgnore): string[];

  /**The project cache data*/
  getCache(): ProjectData;
}
