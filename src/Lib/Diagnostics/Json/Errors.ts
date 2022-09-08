import { TextDocument } from "bc-minecraft-bedrock-project";
import { DocumentLocation } from "bc-minecraft-bedrock-types/lib/src/Types/DocumentLocation";
import { OffsetWord } from 'bc-minecraft-bedrock-types/lib/src/Types/OffsetWord';
import { DiagnosticSeverity } from "../../../main";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";

export function Handle_Json_Error(err: any, doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  if (typeof err.message !== "string") {
    diagnoser.Add(0, "Invalid json structure\nmessage:" + JSON.stringify(err), DiagnosticSeverity.error, "json.invalid");
  }

  const message = err.message;
  let word : OffsetWord = {
    offset:0,
    text:" "
  }

  const token = safe_first_get(/token ([^ ]+) /gim, message);
  if (token) word.text = token;

  const pos = safe_first_get(/position (\d+)/gim, message);
  if (pos) word.offset = Number.parseInt(pos);

  diagnoser.Add(word, message, DiagnosticSeverity.error, "json.invalid");
}

function safe_first_get(regex: RegExp, text: string): string | undefined {
  const match = regex.exec(text);

  if (match) return match[1] ?? match[0];

  return undefined;
}
