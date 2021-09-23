import { MolangSet } from "bc-minecraft-bedrock-project";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../Definitions";
import { animation_controller_diagnose_implementation } from "./Animation Controllers/diagnostics";
import { animation_diagnose_implementation } from "./Animation/diagnostics";

export function animation_or_controller_diagnose_implementation(id: string, data: MolangSet, diagnoser: DiagnosticsBuilder): void {
  switch (is_animation_or_controller(id, diagnoser)) {
    case anim_or_contr.animation:
      return animation_diagnose_implementation(id, data, diagnoser);

    case anim_or_contr.controller:
      return animation_controller_diagnose_implementation(id, data, diagnoser);

    case anim_or_contr.neither:
      diagnoser.Add(id, `Cannot find animation / animation controller: ${id}`, DiagnosticSeverity.error, "resourcepack.anim_or_controller.missing");
  }
}

export enum anim_or_contr {
  animation,
  controller,
  neither,
}

/**
 *
 * @param id
 * @param diagnoser
 * @returns True if animation, false if controller
 */
export function is_animation_or_controller(id: string, diagnoser: DiagnosticsBuilder): anim_or_contr {
  const cache = diagnoser.context.getCache();

  if (cache.ResourcePacks.animations.has(id)) return anim_or_contr.animation;
  if (cache.ResourcePacks.animation_controllers.has(id)) return anim_or_contr.controller;

  const edu = education_enabled(diagnoser);

  //Vanilla has render controller
  if (MinecraftData.ResourcePack.hasAnimation(id, edu)) return anim_or_contr.animation;
  if (MinecraftData.ResourcePack.hasAnimationController(id, edu)) return anim_or_contr.controller;

  return anim_or_contr.neither;
}
