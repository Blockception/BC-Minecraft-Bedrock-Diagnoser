import { DiagnosticSeverity } from "./Severity";
import { Position, JsonPath } from "bc-minecraft-bedrock-project";
import { DiagnoserContext } from "../Context/DiagnoserContext";

/**
 *
 */
export interface DiagnosticsBuilder {
  /**
   *
   */
  context: DiagnoserContext;

  /**
   *
   * @param position
   * @param message
   * @param severity
   */
  Add(position: Position | JsonPath | number, message: string, severity: DiagnosticSeverity): void;
}
