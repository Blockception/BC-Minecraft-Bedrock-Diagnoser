import { Command } from "bc-minecraft-bedrock-command";
import { Modes } from "bc-minecraft-bedrock-types";
import { ModeHandler } from "bc-minecraft-bedrock-types/lib/src/Modes/ModeHandler";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { Types } from "bc-minecraft-bedrock-types";
import { education_enabled } from "../Definitions";
import { SlotTypeMode } from "bc-minecraft-bedrock-types/lib/src/Modes/SlotType";

/**Diagnoses the value as a value in the mode: camerashake
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_camerashake_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.CameraShake, diagnoser);
}

/**Diagnoses the value as a value in the mode: camerashake
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_causetype_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.CauseType, diagnoser);
}

/**Diagnoses the value as a value in the mode: clone
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_clone_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Clone, diagnoser);
}

/**Diagnoses the value as a value in the mode: difficulty
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_difficulty_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Difficulty, diagnoser);
}

/**Diagnoses the value as a value in the mode: fill
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_fill_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Fill, diagnoser);
}

/**Diagnoses the value as a value in the mode: gamemode
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_gamemode_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Gamemode, diagnoser);
}

/**Diagnoses the value as a value in the mode: locatefeature
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_locatefeature_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.LocateFeature, diagnoser);
}

/**Diagnoses the value as a value in the mode: locatefeature
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_handtype_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.HandType, diagnoser);
}

/**Diagnoses the value as a value in the mode: mask
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_mask_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Mask, diagnoser);
}

/**Diagnoses the value as a value in the mode: mirror
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_mirror_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Mirror, diagnoser);
}

/**Diagnoses the value as a value in the mode: musicrepeat
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_musicrepeat_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.MusicRepeat, diagnoser);
}

/**Diagnoses the value as a value in the mode: oldblock
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_oldblock_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.OldBlock, diagnoser);
}

/**Diagnoses the value as a value in the mode: operation
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_operation_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Operation, diagnoser);
}

/**Diagnoses the value as a value in the mode: permission
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_permission_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Permission, diagnoser);
}

/**Diagnoses the value as a value in the mode: permissionState
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_permissionState_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.PermissionState, diagnoser);
}

/**Diagnoses the value as a value in the mode: replace
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_replace_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Replace, diagnoser);
}

/**Diagnoses the value as a value in the mode: ridefill
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_ridefill_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.RideFill, diagnoser);
}

/**Diagnoses the value as a value in the mode: riderules
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_riderules_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.RideRules, diagnoser);
}

/**Diagnoses the value as a value in the mode: rotation
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_rotation_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Rotation, diagnoser);
}

/**Diagnoses the value as a value in the mode: save
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_save_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Save, diagnoser);
}

/**Diagnoses the value as a value in the mode: selectorattribute
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_selectorattribute_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.SelectorAttribute, diagnoser);
}

/**Diagnoses the value as a value in the mode: selectortype
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_selectortype_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.SelectorType, diagnoser);
}

/**Diagnoses the value as a value in the mode: slottype
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_slottype_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.SlotType, diagnoser);
}

/**Diagnoses the value as a value in the mode: slotid
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_slotid_diagnose(
  value: Types.OffsetWord,
  Com: Command | string,
  diagnoser: DiagnosticsBuilder
): boolean {
  if (typeof Com !== "string") {
    //Get the slot type
    const index = Com.parameters.indexOf(value) - 1;
    //if the index is negative, the parameter then was not found
    if (index < 0) return false;
    Com = Com.parameters[index].text;
  }

  //Get the slot type
  const m = <SlotTypeMode>Modes.SlotType.get(Com);
  //if the mode is not found, then the parameter is not valid, expected that the previous parameter handling handled slot type not existing
  if (m === undefined) return false;

  if (m.eduOnly === true && education_enabled(diagnoser) === false) {
    diagnoser.add(
      value.offset,
      "This is an education only mode, and education is disabled",
      DiagnosticSeverity.error,
      "minecraft.mode.edu"
    );
    return false;
  }

  if (m.range) {
    const n = Number.parseInt(value.text);

    if (n < m.range.min || n > m.range.max) {
      diagnoser.add(
        value.offset,
        `The value is ${n} not in the range of ${m.range.min} to ${m.range.max}`,
        DiagnosticSeverity.error,
        "minecraft.mode.range"
      );
      return false;
    }
  }

  return true;
}

/**Diagnoses the value as a value in the mode: structureanimation
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_structureanimation_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.StructureAnimation, diagnoser);
}

/**Diagnoses the value as a value in the mode: teleportrules
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_teleportrules_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.TeleportRules, diagnoser);
}

/**Diagnoses the value as a value in the mode: time
 * @param value The value to evaluate, needs the offset to report bugs
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
export function mode_time_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  return mode_generic_diagnose(value, Modes.Time, diagnoser);
}

/**Diagnoses the value a generic collection of modes
 * @param value The value to evaluate, needs the offset to report bugs
 * @param Mode The collection of values to check against
 * @param diagnoser The diagnoser to report to
 * @returns true or false, false is any error was found*/
function mode_generic_diagnose(value: Types.OffsetWord, Mode: ModeHandler, diagnoser: DiagnosticsBuilder): boolean {
  const m = Mode.get(value.text);

  //Mode returned then it is valid
  if (m) return true;

  const name = Mode.name.toLowerCase();
  diagnoser.add(
    value,
    `value: '${value.text}' is not defined in mode: '${name}'`,
    DiagnosticSeverity.error,
    `minecraft.mode.${name}.invalid`
  );
  return false;
}
