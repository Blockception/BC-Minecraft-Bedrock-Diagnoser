import { DocumentDiagnosticsBuilder } from "../../../types";
import { diagnose_molang_syntax_current_document } from '../../molang';

/**
 * Diagnoses the given document as an spawn rule
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors
 */
export function diagnose_spawn_rule_document(diagnoser: DocumentDiagnosticsBuilder): void {
  diagnose_molang_syntax_current_document(diagnoser);
  //TODO add diagnostics
}
