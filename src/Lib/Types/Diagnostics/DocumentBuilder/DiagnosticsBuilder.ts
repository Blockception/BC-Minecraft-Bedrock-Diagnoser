import { DiagnosticSeverity } from "../Severity";
import { Position, JsonPath } from "bc-minecraft-bedrock-project";

/**
 * 
 */
export interface DiagnosticsBuilder {
	/**
	 * 
	 * @param position 
	 * @param message 
	 * @param severity 
	 */
	Add(position: Position | JsonPath | number, message: string, severity: DiagnosticSeverity): void;
}