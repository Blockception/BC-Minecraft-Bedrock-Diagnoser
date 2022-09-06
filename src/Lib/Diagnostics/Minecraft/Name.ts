import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types/DiagnosticsBuilder";
import { Types } from "bc-minecraft-bedrock-types";
import { Text } from 'bc-minecraft-bedrock-project';
import { check_definition_value } from "../Definitions";

export function minecraft_name_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const text = value.text;
  const id = Text.UnQuote(text);

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.name, id, diagnoser)) return;

  if (text.includes(' '), text.includes('\t')) {
    if (!text.startsWith('"') || !text.endsWith('"'))
      diagnoser.Add(value, "Name includes whitespaces, but hasn't been properly escaped with quotes", DiagnosticSeverity.error, "minecraft.name.unquoted");
  }
}
