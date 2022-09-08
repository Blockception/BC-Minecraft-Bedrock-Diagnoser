import { hasCommandData } from "bc-minecraft-bedrock-command";
import { DiagnosticSeverity } from "../../../main";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { Types } from "bc-minecraft-bedrock-types";

/**
 *
 * @param blockDescriptor
 * @param diagnoser
 */
export function minecraft_check_command(command: Types.OffsetWord, diagnoser: DiagnosticsBuilder, edu: boolean): void {
  if (hasCommandData(command.text, edu)) return;

  diagnoser.Add(command, "Command does not exist: " + command.text, DiagnosticSeverity.error, "minecraft.command.invalid");
}
