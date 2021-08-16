import { Data } from "bc-minecraft-bedrock-command";
import { DiagnosticSeverity } from "../../../main";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { OffsetWord } from "../../Types/OffsetWord";

/**
 *
 * @param blockDescriptor
 * @param diagnoser
 */
export function minecraft_check_command(command: OffsetWord, diagnoser: DiagnosticsBuilder, edu: boolean): void {
  if (Data.hasCommandData(command.text, edu)) return;

  diagnoser.Add(command.offset, "Command does not exist: " + command.text, DiagnosticSeverity.error, "command.invalid");
}
