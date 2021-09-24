import { MolangSet } from "bc-minecraft-molang";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { diagnose_molang_implementation, OwnerType } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(id: string, data: MolangSet, owner :OwnerType, diagnoser: DiagnosticsBuilder): void {
  if (has_animation_controller(id, diagnoser)) {
    molang_animation_controller(id, data, owner, diagnoser);
  }
}

/**
 *
 * @param id
 * @param diagnoser
 * @returns
 */
export function has_animation_controller(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const cache = diagnoser.context.getCache();

  //Project has animation controller
  if (cache.ResourcePacks.animation_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has animation controller
  if (MinecraftData.ResourcePack.hasAnimation(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(id, `Cannot find resourcepack animation controller: ${id}`, DiagnosticSeverity.error, "resourcepack.animation_controller.missing");
  return false;
}

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function molang_animation_controller(id: string, data: MolangSet, owner :OwnerType, diagnoser: DiagnosticsBuilder): void {
  const cache = diagnoser.context.getCache();

  //Project has animation controller
  const anim = cache.ResourcePacks.animation_controllers.get(id);

  if (!anim) return;

  diagnose_molang_implementation(anim.molang, data, owner, diagnoser);
}
