import { MolangSet } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { diagnose_molang } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_diagnose_implementation(id: string, data: MolangSet, diagnoser: DiagnosticsBuilder): void {
  if (has_animation(id, diagnoser)) {
    molang_animation(id, data, diagnoser);
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

  const edu = education_enabled(diagnoser);

  //Nothing then report error
  diagnoser.Add(id, `Cannot find behaviorpack animation: ${id}`, DiagnosticSeverity.error, "behaviorpack.animation.missing");
  return false;
}

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function molang_animation(id: string, data: MolangSet, diagnoser: DiagnosticsBuilder): void {
  const cache = diagnoser.context.getCache();

  //Project has render controller
  const anim = cache.BehaviorPacks.animations.get(id);

  if (!anim) return;

  diagnose_molang(anim.molang, data, diagnoser);
}
