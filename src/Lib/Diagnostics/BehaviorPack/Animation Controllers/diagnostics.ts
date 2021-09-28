import { MolangSet } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { diagnose_molang_implementation, OwnerType } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(id: string, data: MolangSet, ownerid : string, owner : OwnerType, diagnoser: DiagnosticsBuilder): void {
  if (has_animation_controller(id, diagnoser)) {
    general_animation_controllers_implementation()
    molang_animation_controller(id, data, ownerid, owner, diagnoser);
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
  if (cache.BehaviorPacks.animation_controllers.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(`"${id}"`, `Cannot find behaviorpack animation_controller: ${id}`, DiagnosticSeverity.error, "behaviorpack.animation_controller.missing");
  return false;
}

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function molang_animation_controller(id: string, data: MolangSet, ownerid : string, owner : OwnerType, diagnoser: DiagnosticsBuilder): void {
  const cache = diagnoser.context.getCache();

  //Project has animation controller
  const anim = cache.BehaviorPacks.animation_controllers.get(id);

  if (!anim) return;

  diagnose_molang_implementation(anim.id, anim.molang, ownerid, data, owner, diagnoser);
}
