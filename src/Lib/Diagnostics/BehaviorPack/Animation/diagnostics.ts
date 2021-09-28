import { AnimationCarrier, MolangCarrier } from "bc-minecraft-bedrock-project/lib/src/Lib/Types/Carrier/Carrier";
import { Types } from "bc-minecraft-bedrock-types";
import { DefinedUsing, MolangFullSet, MolangSet } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { diagnose_molang_implementation, OwnerType } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_diagnose_implementation(
  anim_id: string,
  user: Types.Identifiable & MolangCarrier<MolangSet | MolangFullSet> & AnimationCarrier<DefinedUsing<string>>,
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder
): void {
  if (has_animation(anim_id, diagnoser)) {
    //Project has animation
    const anim = diagnoser.context.getCache().BehaviorPacks.animations.get(anim_id);

    if (!anim) return;

    diagnose_molang_implementation(anim, user, ownerType, diagnoser);
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
