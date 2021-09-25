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
export function animation_diagnose_implementation(id: string, data: MolangSet, owner : OwnerType, diagnoser: DiagnosticsBuilder): void {
  if (has_animation(id, diagnoser)) {
    molang_animation(id, data, owner, diagnoser);
  }
}

/**
 *
 * @param id
 * @param diagnoser
 * @returns
 */
export function has_animation(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const cache = diagnoser.context.getCache();

  //Project has render controller
  if (cache.BehaviorPacks.animations.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(`"${id}"`, `Cannot find behaviorpack animation: ${id}`, DiagnosticSeverity.error, "behaviorpack.animation.missing");
  return false;
}

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function molang_animation(id: string, data: MolangSet, owner : OwnerType, diagnoser: DiagnosticsBuilder): void {
  const cache = diagnoser.context.getCache();

  //Project has render controller
  const anim = cache.BehaviorPacks.animations.get(id);

  if (!anim) return;

  diagnose_molang_implementation(anim.molang, data, owner, diagnoser);
}
