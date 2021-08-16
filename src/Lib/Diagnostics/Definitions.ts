import { Definition } from "bc-minecraft-project";
import { DiagnosticsBuilder } from "../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../Types/DiagnosticsBuilder/Severity";

/**Returns if the project has education enabled
 * @param diagnoser
 * @returns
 */
export function education_enabled(diagnoser: DiagnosticsBuilder): boolean {
  return diagnoser.project.attributes["education.enable"] === "true";
}

/**Checks if the Definition has the given value, if it has then return `true`, if it also excluded will report it to the diagnoser.
 * If it is neither in defined or excluded then `false` is return
 * @param container The container to check
 * @param value The value to find
 * @param diagnoser The diagnoser to report to
 * @returns false is not found in either exclusion or definitions*/
export function check_definition_value(container: Definition | undefined, value: string, diagnoser: DiagnosticsBuilder): boolean {
  if (Definition.is(container)) {
    //Is defined
    if (container.defined.includes(value)) return true;

    //Is excluded
    if (container.excluded.includes(value)) {
      diagnoser.Add(value, "Value has been blacklisted through the project files", DiagnosticSeverity.error, "project.excluded");

      return true;
    }
  }

  return false;
}