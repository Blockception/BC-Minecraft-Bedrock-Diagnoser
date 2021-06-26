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

  /**
   *
   * @param position
   * @param message
   * @param severity
   */
  Add(position: Position | JsonPath | number, message: string, severity: DiagnosticSeverity): void;
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
