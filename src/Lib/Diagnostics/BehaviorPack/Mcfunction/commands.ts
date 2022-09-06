import { Command, Parameter, ParameterType } from "bc-minecraft-bedrock-command";
import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity, DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/include";
import { education_enabled } from "../../Definitions";
import { general_boolean_diagnose } from "../../General/Boolean";
import { general_float_diagnose } from "../../General/Float";
import { general_integer_diagnose } from "../../General/Integer";
import { general_string_diagnose } from "../../General/String";
import { minecraft_check_command } from "../../Minecraft/Commands";
import { minecraft_coordinate_diagnose } from "../../Minecraft/Coordinate";
import { minecraft_effect_diagnose } from "../../Minecraft/Effect";
import { minecraft_jsonitem_diagnose } from "../../Minecraft/JsonItem";
import { minecraft_jsonrawtext_diagnose } from "../../Minecraft/JsonRawText";
import { minecraft_objectives_diagnose } from "../../Minecraft/Objective";
import { minecraft_selector_diagnose } from "../../Minecraft/Selector";
import { minecraft_tag_diagnose } from "../../Minecraft/Tag";
import { behaviorpack_structure_diagnose } from "../Structure/diagnose";
import { behaviorpack_check_blockdescriptor, behaviorpack_check_blockstates } from "../Block/diagnose";
import { behaviorpack_entityid_diagnose, behaviorpack_entity_event_diagnose, behaviorpack_entity_spawnegg_diagnose } from "../Entity/diagnose";
import { behaviorpack_functions_diagnose } from "./diagnose";
import {
  mode_camerashake_diagnose,
  mode_causetype_diagnose,
  mode_clone_diagnose,
  mode_difficulty_diagnose,
  mode_fill_diagnose,
  mode_gamemode_diagnose,
  mode_handtype_diagnose,
  mode_locatefeature_diagnose,
  mode_mask_diagnose,
  mode_mirror_diagnose,
  mode_musicrepeat_diagnose,
  mode_oldblock_diagnose,
  mode_operation_diagnose,
  mode_replace_diagnose,
  mode_ridefill_diagnose,
  mode_riderules_diagnose,
  mode_rotation_diagnose,
  mode_save_diagnose,
  mode_slotid_diagnose,
  mode_slottype_diagnose,
  mode_structureanimation_diagnose,
  mode_teleportrules_diagnose,
  mode_time_diagnose,
} from "../../Mode/diagnose";
import { behaviorpack_item_diagnose } from "../Item/diagnose";
import { minecraft_xp_diagnose } from "../../Minecraft/Xp";
import { general_keyword_diagnose } from "../../General/Keyword";
import { minecraft_tickingarea_diagnose } from "../../Minecraft/Tickingarea";
import { resourcepack_particle_diagnose } from "../../ResourcePack/Particle/diagnose";
import { resourcepack_sound_diagnose } from "../../ResourcePack/Sounds Definitions/diagnose";
import { animation_reference_diagnose } from "../../ResourcePack/anim or controller";
import { Types } from "bc-minecraft-bedrock-types";
import { behaviorpack_loot_table_diagnose } from "../Loot Table/diagnose";

/**
 *
 * @param doc
 * @param diagnoser
 */
export function mcfunction_commandscheck(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const edu = education_enabled(diagnoser);
  const text = doc.getText();
  const lines = text.split("\n");

  for (let I = 0; I < lines.length; I++) {
    const line = lines[I].trim();

    if (line === "") continue;
    //If the line is a whole comment then skip
    if (line.startsWith("#")) continue;

    const offset = text.indexOf(line);
    let comm: Command | undefined = Command.parse(line, offset);

    if (comm.isEmpty()) continue;

    while (comm) {
      mcfunction_commandcheck(comm, diagnoser, edu);

      comm = comm.getSubCommand();
    }
  }
}

/**
 *
 * @param prop
 * @param doc
 * @param diagnoser
 */
export function json_commandscheck(prop: string | string[], doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  if (typeof prop === "string") {
    if (prop.startsWith("/")) {
      commandscheck(prop.substring(1), doc, diagnoser);
    }
  } else {
    prop.forEach((p) => {
      if (p.startsWith("/")) {
        commandscheck(p.substring(1), doc, diagnoser);
      }
    });
  }
}

/**
 *
 * @param commandtext
 * @param doc
 * @param diagnoser
 * @returns
 */
export function commandscheck(commandtext: string, doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  if (commandtext.length < 3) return;

  const edu = education_enabled(diagnoser);
  const offset = doc.getText().indexOf(commandtext);
  let comm: Command | undefined = Command.parse(commandtext, offset);

  if (comm.isEmpty()) return;

  while (comm) {
    mcfunction_commandcheck(comm, diagnoser, edu);

    comm = comm.getSubCommand();
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
    diagnoser.Add(
      command.parameters[0].offset,
      `Unknown command syntax: "${command.getKeyword()}"`,
      DiagnosticSeverity.error,
      "behaviorpack.mcfunction.syntax.unknown"
    );
    return;
  }

  const data = info[0];
  const max = Math.min(data.parameters.length, command.parameters.length);

  for (let I = 0; I < max; I++) {
    mcfunction_diagnoseparameter(data.parameters[I], command.parameters[I], diagnoser, command, edu);
  }
}

/**Switch data*/
const ParameterDiagnostics: Record<number, (value: Types.OffsetWord, diagnoser: DiagnosticsBuilder) => void | boolean> = {
  [ParameterType.animation]: animation_reference_diagnose,
  [ParameterType.block]: behaviorpack_check_blockdescriptor,
  [ParameterType.blockStates]: behaviorpack_check_blockstates,
  [ParameterType.boolean]: general_boolean_diagnose,
  [ParameterType.cameraShakeType]: mode_camerashake_diagnose,
  [ParameterType.causeType]: mode_causetype_diagnose,
  [ParameterType.cloneMode]: mode_clone_diagnose,
  //Custom call [ParameterType.command]:,
  [ParameterType.coordinate]: minecraft_coordinate_diagnose,
  [ParameterType.difficulty]: mode_difficulty_diagnose,
  [ParameterType.effect]: minecraft_effect_diagnose,
  [ParameterType.entity]: behaviorpack_entityid_diagnose,
  //Custom call [ParameterType.event]:behaviorpack_entity_event_diagnose,
  [ParameterType.fillMode]: mode_fill_diagnose,
  [ParameterType.function]: behaviorpack_functions_diagnose,
  [ParameterType.float]: general_float_diagnose,
  [ParameterType.gamemode]: mode_gamemode_diagnose,
  [ParameterType.handType]: mode_handtype_diagnose,
  [ParameterType.integer]: general_integer_diagnose,
  [ParameterType.item]: (item, diagnoser) => {
    if (item.text.endsWith("_spawn_egg")) {
      behaviorpack_entity_spawnegg_diagnose(item, diagnoser);
    } else {
      behaviorpack_item_diagnose(item, diagnoser);
    }
  },
  [ParameterType.jsonItem]: minecraft_jsonitem_diagnose,
  [ParameterType.jsonRawText]: minecraft_jsonrawtext_diagnose,
  //Custom call [ParameterType.keyword]:general_keyword_diagnose,
  [ParameterType.locateFeature]: mode_locatefeature_diagnose,
  [ParameterType.lootTable]: behaviorpack_loot_table_diagnose,
  //Custom call [ParameterType.message]:,
  [ParameterType.maskMode]: mode_mask_diagnose,
  [ParameterType.mirror]: mode_mirror_diagnose,
  [ParameterType.musicRepeatMode]: mode_musicrepeat_diagnose,
  [ParameterType.objective]: minecraft_objectives_diagnose,
  [ParameterType.oldBlockMode]: mode_oldblock_diagnose,
  [ParameterType.operation]: mode_operation_diagnose,
  [ParameterType.particle]: resourcepack_particle_diagnose,
  [ParameterType.replaceMode]: mode_replace_diagnose,
  [ParameterType.rideRules]: mode_riderules_diagnose,
  [ParameterType.ridefillMode]: mode_ridefill_diagnose,
  [ParameterType.rotation]: mode_rotation_diagnose,
  [ParameterType.saveMode]: mode_save_diagnose,
  //Custom call [ParameterType.selector]:minecraft_selector_diagnose,
  [ParameterType.slotType]: mode_slottype_diagnose,
  //Custom call [ParameterType.slotID]:,
  [ParameterType.sound]: resourcepack_sound_diagnose,
  [ParameterType.string]: general_string_diagnose,
  [ParameterType.structure]: behaviorpack_structure_diagnose,
  [ParameterType.structureAnimationMode]: mode_structureanimation_diagnose,
  [ParameterType.tag]: minecraft_tag_diagnose,
  [ParameterType.teleportRules]: mode_teleportrules_diagnose,
  [ParameterType.tickingarea]: minecraft_tickingarea_diagnose,
  [ParameterType.time]: mode_time_diagnose,
  //Custom call ParameterType.unknown]:(item, diagnoser)=>diagnoser.Add(item.offset, "Unknown parametype: " + item.type, DiagnosticSeverity.warning, "debugger.error"),
  [ParameterType.xp]: minecraft_xp_diagnose,
};

/**
 *
 * @param pattern
 * @param data
 * @param diagnoser
 * @param Com
 * @param edu
 * @returns
 */
function mcfunction_diagnoseparameter(
  pattern: ParameterInfo,
  data: Parameter,
  diagnoser: DiagnosticsBuilder,
  Com: Command,
  edu: boolean
): void | boolean {
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

  //Get specific call
  const call = ParameterDiagnostics[pattern.type];

  //If call is found, then use that
  if (call) {
    return call(data, diagnoser);
  }

  //Custom calls
  switch (pattern.type) {
    case ParameterType.command:
      return minecraft_check_command(data, diagnoser, edu);
    case ParameterType.event:
      return behaviorpack_entity_event_diagnose(data, diagnoser, Com);
    case ParameterType.keyword:
      return general_keyword_diagnose(pattern.text, data, diagnoser);
    case ParameterType.message:
      return true; //TODO message check
    case ParameterType.selector:
      return minecraft_selector_diagnose(pattern, data, diagnoser);
    case ParameterType.slotID:
      return mode_slotid_diagnose(data, Com, diagnoser);

    case ParameterType.unknown:
      diagnoser.Add(data.offset, `Unknown parametype: ${pattern.type}:${ParameterType[pattern.type]}`, DiagnosticSeverity.warning, "debugger.error");
      return false;
  }
}
