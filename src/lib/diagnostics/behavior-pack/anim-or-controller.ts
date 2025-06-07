import { MolangDataSetKey } from "bc-minecraft-molang";
import { DiagnosticsBuilder, DiagnosticSeverity, EntityAnimationMolangCarrier, EventCarrier } from "../../types";
import { diagnose_animation_implementation } from "./animation";
import { diagnose_animation_controller_implementation } from "./animation-controllers/diagnostics";

/**
 * @param id
 * @param user
 * @param ownerType
 * @param diagnoser
 * @returns
 */
export function diagnose_animation_or_controller_implementation(
  id: string,
  user: EntityAnimationMolangCarrier & EventCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  switch (is_animation_or_controller(id, diagnoser)) {
    case anim_or_contr.animation:
      return diagnose_animation_implementation(id, user, ownerType, diagnoser);

    case anim_or_contr.controller:
      return diagnose_animation_controller_implementation(id, user, ownerType, diagnoser);

    case anim_or_contr.neither:
      diagnoser.add(
        id,
        `Cannot find animation / animation controller: ${id}`,
        DiagnosticSeverity.error,
        "behaviorpack.animation_or_controller.missing"
      );
  }
}

/** The result of the animation or controller check */
export enum anim_or_contr {
  /** the id is an animation */
  animation,
  /** the id is an animation controller */
  controller,
  /** the id is neither an animation nor an animation controller */
  neither,
}

/** is an animation or controller.
 * @param id The id of the animation or controller
 * @param diagnoser The diagnostics builder to add the errors to
 * @returns True if animation, false if controller*/
export function is_animation_or_controller(id: string, diagnoser: DiagnosticsBuilder): anim_or_contr {
  const bp = diagnoser.context.getProjectData().behaviors;
  if (bp.animations.has(id, diagnoser.project)) return anim_or_contr.animation;
  if (bp.animation_controllers.has(id, diagnoser.project)) return anim_or_contr.controller;

  return anim_or_contr.neither;
}
