import { Molang } from 'bc-minecraft-molang';
import { DiagnosticSeverity, DiagnosticsBuilder } from "../../Types";
import { IsMolangType, MolangType } from 'bc-minecraft-molang/lib/src/Molang';

/**
 *
 * @param molang
 * @param diagnoser
 */
export function diagnose_molang_syntax_expression(molang: string, diagnoser: DiagnosticsBuilder) {
  if (IsMolangType(molang) === MolangType.unknown) {
    return;
  }

  const complex = molang.includes("=") || molang.includes(";");

  if (complex && !molang.endsWith(";")) {
    diagnoser.Add(
      molang,
      `Molang expression is complex and should end with a ';'`,
      DiagnosticSeverity.error,
      "molang.syntax.missing_semicolon"
    );
  }
}

/**
 * 
 * @param data 
 * @param diagnoser 
 */
export function diagnoser_molang_syntax(data: any, diagnoser: DiagnosticsBuilder) {
  Molang.Traverse(data, (molang) => diagnose_molang_syntax_expression(molang, diagnoser));
}