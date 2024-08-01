import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { EntityAnimationMolangCarrier, EventCarrier, TextDocument } from "../../Types/Interfaces";
import { animation_controller_diagnose_implementation } from "./Animation Controllers/diagnostics";
import { animation_diagnose_implementation } from "./Animation/diagnostics";
import { MolangDataSetKey } from "bc-minecraft-molang";

/**
 * @param id
 * @param user
 * @param ownerType
 * @param diagnoser
 * @returns
 */
export function animation_or_controller_diagnose_implementation(
  id: string,
  user: EntityAnimationMolangCarrier & EventCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  switch (is_animation_or_controller(id, diagnoser)) {
    case anim_or_contr.animation:
      return animation_diagnose_implementation(id, user, ownerType, diagnoser);

    case anim_or_contr.controller:
      return animation_controller_diagnose_implementation(id, user, ownerType, diagnoser);

    case anim_or_contr.neither:
      diagnoser.add(
        id,
        `Cannot find animation / animation controller: ${id}`,
        DiagnosticSeverity.error,
        "behaviorpack.anim_or_controller.missing"
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
  const cache = diagnoser.context.getCache();

  if (cache.behaviorPacks.animations.has(id)) return anim_or_contr.animation;
  if (cache.behaviorPacks.animation_controllers.has(id)) return anim_or_contr.controller;

  return anim_or_contr.neither;
}
