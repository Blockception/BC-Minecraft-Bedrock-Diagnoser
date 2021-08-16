import { Command, Parameter, ParameterType } from "bc-minecraft-bedrock-command";
import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../../main";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { general_boolean_diagnose } from "../../General/Boolean";
import { general_float_diagnose } from "../../General/Float";
import { general_integer_diagnose } from "../../General/Integer";
import { general_string_diagnose } from "../../General/String";
import { minecraft_check_command } from "../../Minecraft/Commands";
import { general_coordinate_diagnose } from "../../Minecraft/Coordinate";
import { minecraft_effect_diagnose } from "../../Minecraft/Effect";
import { general_jsonitem_diagnose } from "../../Minecraft/JsonItem";
import { general_jsonrawtext_diagnose } from "../../Minecraft/JsonRawText";
import { general_objectives_diagnose } from "../../Minecraft/Objective";
import { minecraft_selector_diagnose } from "../../Minecraft/Selector";
import { general_tag_diagnose } from "../../Minecraft/Tag";
import { behaviorpack_check_blockdescriptor, behaviorpack_check_blockstates } from "../Block/diagnose";
import { behaviorpack_entityid_diagnose, behaviorpack_entity_event_diagnose } from "../Entity/diagnose";
import { behaviorpack_functions_diagnose } from "./diagnose";
import {
  mode_camerashake_diagnose,
  mode_clone_diagnose,
  mode_fill_diagnose,
  mode_gamemode_diagnose,
  mode_locatefeature_diagnose,
  mode_mask_diagnose,
  mode_mirror_diagnose,
  mode_musicrepeat_diagnose,
  mode_oldblock_diagnose,
  mode_operation_diagnose,
  mode_replace_diagnose,
  mode_riderules_diagnose,
  mode_rotation_diagnose,
  mode_save_diagnose,
  mode_slotid_diagnose,
  mode_slottype_diagnose,
  mode_structureanimation_diagnose,
  mode_teleportrules_diagnose,
} from "../../Mode/diagnose";
import { behaviorpack_item_diagnose } from "../Item/diagnose";
import { minecraft_xp_diagnose } from "../../Minecraft/Xp";
import { general_keyword_diagnose } from "../../General/Keyword";
import { minecraft_tickingarea_diagnose } from "../../Minecraft/Tickingarea";
import { resourcepack_particle_diagnose } from "../../ResourcePack/Particle/diagnose";
import { resourcepack_sound_diagnose } from "../../ResourcePack/Sounds Definitions/diagnose";
import { Diagnoser } from "../../../Types/Diagnoser/Diagnoser";


/**
 *
 * @param doc
 * @param diagnoser
 */
export function mcfunction_commandscheck(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const edu = education_enabled(diagnoser);
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

/**
 *
 * @param command
 * @param diagnoser
 * @param edu
 * @returns
 */
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

/**
 *
 * @param pattern
 * @param data
 * @param builder
 * @param Com
 * @param edu
 * @returns
 */
function mcfunction_diagnoseparameter(pattern: ParameterInfo, data: Parameter, builder: DiagnosticsBuilder, Com: Command, edu: boolean): void {
  if (pattern === undefined || data === undefined) return;

  if (pattern.options) {
    //If wildcard is allowed and the text is an wildcard, then skip diagnose
    if (pattern.options.wildcard === true) {
      if (data.text === "*") return;
    }

    //If accepted values is filled in and the text is a match, then skip diagnose
    if (pattern.options.acceptedValues?.includes(data.text)) {
      return;
    }
  }

  switch (pattern.type) {
    case ParameterType.block: return behaviorpack_check_blockdescriptor(data.text, builder);
    case ParameterType.blockStates: return behaviorpack_check_blockstates(data.text, builder);
    case ParameterType.boolean: return general_boolean_diagnose(data, builder);
    case ParameterType.cameraShakeType: return mode_camerashake_diagnose(data, builder);
    case ParameterType.cloneMode: return mode_clone_diagnose(data, builder);
    case ParameterType.command: return minecraft_check_command(data, builder, edu);
    case ParameterType.coordinate: return general_coordinate_diagnose(data, builder);
    case ParameterType.effect: return minecraft_effect_diagnose(data, builder);
    case ParameterType.entity: return behaviorpack_entityid_diagnose(data, builder);
    case ParameterType.event: return behaviorpack_entity_event_diagnose(data, builder, Com);
    case ParameterType.fillMode: return mode_fill_diagnose(data, builder);
    case ParameterType.float: return general_float_diagnose(data, builder);
    case ParameterType.function: return behaviorpack_functions_diagnose(data, builder);
    case ParameterType.gamemode: return mode_gamemode_diagnose(data, builder);
    case ParameterType.integer: return general_integer_diagnose(data, builder);
    case ParameterType.item: return behaviorpack_item_diagnose(data, builder);
    case ParameterType.jsonItem: return general_jsonitem_diagnose(data, builder);
    case ParameterType.jsonRawText: return general_jsonrawtext_diagnose(data, builder);
    case ParameterType.keyword: return general_keyword_diagnose(pattern.text, data, builder);
    case ParameterType.locateFeature: return mode_locatefeature_diagnose(data, builder);
    case ParameterType.maskMode: return mode_mask_diagnose(data, builder);
    case ParameterType.mirror: return mode_mirror_diagnose(data, builder);
    case ParameterType.musicRepeatMode: return mode_musicrepeat_diagnose(data, builder);
    case ParameterType.oldBlockMode: return mode_oldblock_diagnose(data, builder);
    case ParameterType.objective: return general_objectives_diagnose(data, builder);
    case ParameterType.operation: return mode_operation_diagnose(data, builder);
    case ParameterType.particle: return resourcepack_particle_diagnose(data, builder);
    case ParameterType.replaceMode: return mode_replace_diagnose(data, builder);
    case ParameterType.rideRules: return mode_riderules_diagnose(data, builder);
    case ParameterType.rotation: return mode_rotation_diagnose(data, builder);
    case ParameterType.saveMode: return mode_save_diagnose(data, builder);
    case ParameterType.selector: return minecraft_selector_diagnose(pattern, data, builder);
    case ParameterType.slotID: return mode_slotid_diagnose(data, Com, builder);
    case ParameterType.slotType: return mode_slottype_diagnose(data, builder);
    case ParameterType.sound: return resourcepack_sound_diagnose(data, builder);
    case ParameterType.string: return general_string_diagnose(data, builder);
    case ParameterType.structureAnimationMode: return mode_structureanimation_diagnose(data, builder);
    case ParameterType.tag: return general_tag_diagnose(data, builder);
    case ParameterType.teleportRules: return mode_teleportrules_diagnose(data, builder);
    case ParameterType.tickingarea: return minecraft_tickingarea_diagnose(data, builder);
    case ParameterType.xp: return minecraft_xp_diagnose(data, builder);
    case ParameterType.unknown:

      builder.Add(data.offset, "Unknown parametype: " + pattern.type, DiagnosticSeverity.warning, "debugger.error");
      return;
  }
}












