import { Command, Parameter, ParameterType } from "bc-minecraft-bedrock-command";
import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../../main";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";

export function mcfunction_commandscheck(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const edu = diagnoser.project.attributes["diagnostic.enable"] === "true";
  const text = doc.getText();
  const lines = text.split("/n");

  for (let I = 0; I < lines.length; I++) {
    const line = lines[I].trim();

    if (line === "") continue;
    //If the line is a whole comment then skip
    if (line.startsWith("#")) continue;

    const offset = text.indexOf(line);
    const comm = Command.parse(line, offset);

    if (comm.isEmpty()) continue;

    mcfunction_commandcheck(comm, diagnoser, edu);
  }
}

function mcfunction_commandcheck(command: Command, diagnoser: DiagnosticsBuilder, edu: boolean): void {
  const info = command.getBestMatch(edu);

  if (info.length === 0) {
    diagnoser.Add(command.parameters[0].offset, `Unknown command syntax: "${command.getKeyword()}"`, DiagnosticSeverity.error, "mcfunction.syntax.unknown");
    return;
  }

  const data = info[0];
  const max = Math.min(data.parameters.length, command.parameters.length);

  for (let I = 0; I < max; I++) {
    mcfunction_diagnoseparameter(data.parameters[I], command.parameters[I], diagnoser, command, edu);
  }
}

function mcfunction_diagnoseparameter(pattern: ParameterInfo, data: Parameter, builder: DiagnosticsBuilder, Com: Command, edu: boolean): void {
  if (pattern === undefined || data === undefined) return;

  if (pattern.options) {
    //If wildcard is allowed and the text is an wildcard, then skip diagnose
    if (pattern.options.wildcard && pattern.options.wildcard === true) {
      if (data.text === "*") return;
    }

    //If accepted values is filled in and the text is a match, then skip diagnose
    if (pattern.options.acceptedValues) {
      if (pattern.options.acceptedValues.includes(data.text)) {
        return;
      }
    }
  }

  switch (pattern.type) {
    case ParameterType.block:
      return Block.ProvideDiagnostic(data, builder);

    case ParameterType.blockStates:
      return BlockStates.ProvideDiagnostic(data, builder);

    case ParameterType.boolean:
      return Boolean.ProvideDiagnostic(data, builder);

    case ParameterType.cameraShakeType:
      return CameraShakeMode.ProvideDiagnostic(data, builder);

    case ParameterType.cloneMode:
      return CloneMode.ProvideDiagnostic(data, builder);

    case ParameterType.command:
      return Command.DiagnoseCommandParameter(data, builder, edu);

    case ParameterType.coordinate:
      return Coordinate.ProvideDiagnostic(data, builder);

    case ParameterType.effect:
      return Effect.ProvideDiagnostic(data, builder);

    case ParameterType.entity:
      return Entity.ProvideDiagnostic(data, builder);

    case ParameterType.event:
      return Event.ProvideDiagnostic(data, builder); //TODO provide entity ID

    case ParameterType.fillMode:
      return FillMode.ProvideDiagnostic(data, builder);

    case ParameterType.float:
      return Float.ProvideDiagnostic(data, builder);

    case ParameterType.function:
      return Functions.ProvideDiagnostic(data, builder);

    case ParameterType.gamemode:
      return Gamemode.ProvideDiagnostic(data, builder);

    case ParameterType.integer:
      return Integer.ProvideDiagnostic(data, builder);

    case ParameterType.item:
      return Item.ProvideDiagnostic(data, builder);

    case ParameterType.jsonItem:
    case ParameterType.jsonRawText:
      //TODO
      return;

    case ParameterType.keyword:
      return Keyword.ProvideDiagnostic(pattern, data, builder);

    case ParameterType.locateFeature:
      return LocateFeature.ProvideDiagnostic(data, builder);

    case ParameterType.maskMode:
      return MaskMode.ProvideDiagnostic(data, builder);

    case ParameterType.mirror:
      return MirrorMode.ProvideDiagnostic(data, builder);

    case ParameterType.musicRepeatMode:
      return MusicRepeatMode.ProvideDiagnostic(data, builder);

    case ParameterType.oldBlockMode:
      return OldBlockMode.ProvideDiagnostic(data, builder);

    case ParameterType.objective:
      return Objectives.ProvideDiagnostic(data, builder);

    case ParameterType.operation:
      return OperationMode.ProvideDiagnostic(data, builder);

    case ParameterType.particle:
      return Particle.ProvideDiagnostic(data, builder);

    case ParameterType.replaceMode:
      return ReplaceMode.ProvideDiagnostic(data, builder);

    case ParameterType.rideRules:
      return RideRulesMode.ProvideDiagnostic(data, builder);

    case ParameterType.rotation:
      return RotationMode.ProvideDiagnostic(data, builder);

    case ParameterType.saveMode:
      return SaveMode.ProvideDiagnostic(data, builder);

    case ParameterType.selector:
      return Selector.ProvideDiagnostic(pattern, data, builder);

    case ParameterType.slotID:
      return Slot_id.ProvideDiagnostic(data, Com, builder);

    case ParameterType.slotType:
      return Slot_type.ProvideDiagnostic(data, builder);

    case ParameterType.sound:
      return Sound.ProvideDiagnostic(data, builder);

    case ParameterType.string:
      return String.ProvideDiagnostic(data, builder);

    case ParameterType.structureAnimationMode:
      return StructureAnimationMode.ProvideDiagnostic(data, builder);

    case ParameterType.tag:
      return Tag.ProvideDiagnostic(data, builder);

    case ParameterType.teleportRules:
      return TeleportRulesMode.ProvideDiagnostic(data, builder);

    case ParameterType.tickingarea:
      return Tickingarea.ProvideDiagnostic(data, builder);

    case ParameterType.unknown:
      return;

    case ParameterType.xp:
      Xp.ProvideDiagnostic(data, builder);
      return;
  }
}
