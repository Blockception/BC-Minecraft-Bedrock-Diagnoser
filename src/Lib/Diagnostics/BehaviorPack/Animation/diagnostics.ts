import { MolangDataSetKey } from 'bc-minecraft-molang';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types';
import { EntityAnimationMolangCarrier, EventCarrier } from "../../../Types/Interfaces";
import { diagnose_molang_implementation } from "../../Molang/diagnostics";

type User = EntityAnimationMolangCarrier & EventCarrier;

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_diagnose_implementation(
  anim_id: string,
  user: User,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  if (!has_animation(anim_id, diagnoser)) return;

  //Project has animation
  const anim = diagnoser.context.getCache().BehaviorPacks.animations.get(anim_id);

  if (!anim) return;

  diagnose_molang_implementation(anim, user, ownerType, diagnoser);
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
  diagnoser.Add(
    `"${id}"`,
    `Cannot find behaviorpack animation: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.animation.missing"
  );
  return false;
}
