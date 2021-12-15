import { Map } from "bc-minecraft-bedrock-project";
import { AnimationCarrier, MolangCarrier } from "bc-minecraft-bedrock-project/lib/src/Lib/Types/Carrier/Carrier";
import { Types } from "bc-minecraft-bedrock-types";
import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { OwnerType } from "../Molang/diagnostics";
import { animation_controller_diagnose_implementation } from "./Animation Controllers/diagnostics";
import { animation_diagnose_implementation } from "./Animation/diagnostics";

/** 
 * @param id 
 * @param user 
 * @param ownerType 
 * @param diagnoser 
 * @returns 
 */
export function animation_or_controller_diagnose_implementation(
  id: string,
  user: Types.Identifiable & MolangCarrier<Molang.MolangSet | Molang.MolangFullSet> & AnimationCarrier<DefinedUsing<string>> & { events?: Map<any> },
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder
): void {
  switch (is_animation_or_controller(id, diagnoser)) {
    case anim_or_contr.animation:
      return animation_diagnose_implementation(id, user, ownerType, diagnoser);

    case anim_or_contr.controller:
      return animation_controller_diagnose_implementation(id, user, ownerType, diagnoser);

    case anim_or_contr.neither:
      diagnoser.Add(id, `Cannot find animation / animation controller: ${id}`, DiagnosticSeverity.error, "behaviorpack.anim_or_controller.missing");
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

  if (cache.BehaviorPacks.animations.has(id)) return anim_or_contr.animation;
  if (cache.BehaviorPacks.animation_controllers.has(id)) return anim_or_contr.controller;

  return anim_or_contr.neither;
}
