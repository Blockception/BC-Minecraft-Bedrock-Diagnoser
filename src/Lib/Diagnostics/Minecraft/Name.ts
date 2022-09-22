import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types";
import { Types } from "bc-minecraft-bedrock-types";
import { Text } from "bc-minecraft-bedrock-project";
import { check_definition_value } from "../Definitions";

/**
 * Checks if the given name exists or is valid.
 * @param value The name to check
 * @param diagnoser The diagnoser
 * @returns True if the name exists
 */
export function minecraft_name_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  const text = value.text;
  const id = Text.UnQuote(text);

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.name, id, diagnoser)) {
    return true;
  }

  if (text.includes(" ") || text.includes("\t")) {
    if (text.startsWith('"') && text.endsWith('"')) {
      return true;
    }

    diagnoser.Add(
      value,
      "Name includes whitespace, but hasn't been properly escaped with quotes",
      DiagnosticSeverity.error,
      "minecraft.name.unquoted"
    );
    return false;
  }

  return true;
}
