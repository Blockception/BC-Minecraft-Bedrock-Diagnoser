import { TextDocument } from 'bc-minecraft-bedrock-project';
import { ExpressionNode, MolangSet, MolangSyntaxError, NodeType } from 'bc-minecraft-molang/lib/src/Molang';
import { DiagnosticsBuilder, DiagnosticSeverity, DocumentDiagnosticsBuilder } from '../../types';

export function diagnose_molang_syntax_current_document(diagnoser: DocumentDiagnosticsBuilder, obj?: object) {
  return diagnose_molang_syntax_document(diagnoser.document, diagnoser, obj);
}

export function diagnose_molang_syntax_document(doc: TextDocument, diagnoser: DiagnosticsBuilder, obj?: object) {
  const objSet = obj ?? JSON.parse(doc.getText());
  const set = new MolangSet();
  try {
    set.harvest(objSet, doc.getText());
  } catch (err) {
    if (err instanceof MolangSyntaxError) {
      diagnoser.add(err.position, err.message, DiagnosticSeverity.error, `molang.${err.code}`);
    } else {
      diagnoser.add(0, `unknown error was thrown during parsing of molang, please submit an github issue.\n${JSON.stringify(err, null, 2)}`, DiagnosticSeverity.error, "molang.error.unknown");
    }
  } finally {
  }

  return diagnose_molang_syntax_set(set, diagnoser);
}

export function diagnose_molang_syntax_set(set: MolangSet, diagnoser: DiagnosticsBuilder) {
  // Check using
  set.using.forEach((using) => {
    for (let item of set.assigned.values()) {
      if (item.scope == using.scope && item.names === using.names) return;
    }

    diagnoser.add(using.position, `couldn't find the definition of ${using.scope}.${using.names.join('.')}`, DiagnosticSeverity.error, "molang.undefined");
  });

  // Check functions parameters
  set.functions;

  // Check syntax
  for (let exps of set.cache.expressions()) {
    exps.forEach((exp) => {
      diagnose_molang_syntax(exp, diagnoser);
      diagnose_molang_syntax_optimizations(exp, diagnoser);
    });
  }
}

export function diagnose_molang_syntax(expression: ExpressionNode, diagnoser: DiagnosticsBuilder) {
  const objs: ExpressionNode[] = [expression];

  for (let i = 0; i < objs.length; i++) {
    const n = objs[i];
    switch (n.type) {
      case NodeType.ResourceReference:
      case NodeType.Variable:
        if ((n.names as string[]).length === 0) diagnoser.add(n.position, `expected something after '${n.scope}.' but found nothing`, DiagnosticSeverity.error, "molang.identifier.invalid");
        if ((n.names as string[]).length > 2) diagnoser.add(n.position, `found to many nesting in '${n.scope}.${n.names.join(',')}'`, DiagnosticSeverity.error, "molang.identifier.invalid");

        switch (n.scope.toLowerCase()) {
          case "geometry":
          case "material":
          case "texture":
            break;
          default:
            diagnoser.add(n.position, `unknown variable/resource starting identifier: '${n.scope}' for '${n.scope}.${n.names.join('.')}'`, DiagnosticSeverity.error, "molang.identifier.scope");
        }

        break;
      case NodeType.ArrayAccess:
        objs.push(n.array, n.index);
        break;
      case NodeType.Assignment:
        // TODO left should be a resource / variable
        objs.push(n.left, n.right);
        break;
      case NodeType.BinaryOperation:
        objs.push(n.left, n.right);
        // TODO check operator
        break;
      case NodeType.Conditional:
        objs.push(n.condition, n.falseExpression, n.trueExpression);
        break;
      case NodeType.FunctionCall:
        objs.push(...n.arguments);
        break;
      case NodeType.StringLiteral:
      case NodeType.Literal:
        break;
      case NodeType.NullishCoalescing:
        objs.push(n.left, n.right);
        break;
      case NodeType.StatementSequence:
        objs.push(...n.statements);
        break;
      case NodeType.UnaryOperation:
        objs.push(n.operand);
        // TODO check operator
        break;

      case NodeType.Marker:
      default:
        diagnoser.add(n.position, `unknown piece of molang syntax: ${JSON.stringify(n)}`, DiagnosticSeverity.error, "molang.diagnoser.syntax");
    }
  }
};

export function diagnose_molang_syntax_optimizations(expression: ExpressionNode, diagnoser: DiagnosticsBuilder) {
  // TODO: optimizations
};