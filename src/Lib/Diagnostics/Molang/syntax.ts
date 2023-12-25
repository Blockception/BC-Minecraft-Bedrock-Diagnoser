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

  const complex = molang.includes(";") || has_assign_operator(molang);

  if (complex && !molang.endsWith(";")) {
    diagnoser.add(
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
  Molang.Traverse(data, (molang, type) => {
    // Skip commands
    if (type === MolangType.command) {
      return;
    }
    diagnose_molang_syntax_expression(molang, diagnoser)
  });
}

function has_assign_operator(text: string): boolean {
  // Using regex, Check for = but ensure its not = or <= or >=
  return /[^<>!+\-*\/=]=[^<>=]/.test(text);
}