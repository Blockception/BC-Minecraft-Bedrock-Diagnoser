import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { minecraft_coordinate_diagnose } from "../Coordinate";

/**
 *
 * @param name
 * @param selector
 * @param receiver
 */
export function selectorattribute_coordinate(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  if (value.text.startsWith("^")) {
    diagnoser.Add(
      value,
      "Selector attribute coordinate cannot be local coordinates types, only relative or absolute",
      DiagnosticSeverity.error,
      "selector.coordinate.invalid"
    );

    return false;
  }

  return minecraft_coordinate_diagnose(value, diagnoser);
}
