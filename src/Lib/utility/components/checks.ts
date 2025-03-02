import { ComponentBehavior, ComponentContainer } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DocumentDiagnosticsBuilder, DiagnosticSeverity } from "../../Types";
import { Context } from "./components";

export type ComponentCheck<T> = (
  name: string,
  component: any,
  context: Context<T>,
  diagnoser: DocumentDiagnosticsBuilder
) => void;

export function component_error<T>(message: string, code: string | number): ComponentCheck<T> {
  return (name, _component, _context, diagnoser) => {
    diagnoser.add(name, message, DiagnosticSeverity.error, code);
  };
}

export function component_warning<T>(message: string, code: string | number): ComponentCheck<T> {
  return (name, _component, _context, diagnoser) => {
    diagnoser.add(name, message, DiagnosticSeverity.warning, code);
  };
}

export function components_check<T>(
  data: ComponentBehavior | undefined,
  context: Context<T>,
  diagnoser: DocumentDiagnosticsBuilder,
  component_test: Record<string, ComponentCheck<T>>
): void {
  if (data === undefined) return;

  compContainerCheck(data.components, context, diagnoser, component_test);
  compContainerCheck(data, context, diagnoser, component_test);

  if (data.component_groups) {
    Object.entries(data.component_groups).forEach(([, group]) => {
      compContainerCheck(group, context, diagnoser, component_test);
    });
  }
}

function compContainerCheck<T>(
  container: ComponentContainer | undefined,
  context: Context<T>,
  diagnoser: DocumentDiagnosticsBuilder,
  component_test: Record<string, ComponentCheck<T>>
): void {
  if (container === undefined) return;

  const keys = Object.getOwnPropertyNames(container);

  keys.forEach((key) => {
    const callbackfn = component_test[key];

    if (callbackfn) {
      callbackfn(key, container[key], context, diagnoser);
    }
  });
}
