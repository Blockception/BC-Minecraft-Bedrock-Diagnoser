import { MolangDataSetKey } from "bc-minecraft-molang";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { education_enabled } from "../Definitions";
import { animation_controller_diagnose_implementation } from "./Animation Controllers/diagnostics";
import { animation_diagnose_implementation } from "./Animation/diagnostics";
import { Types } from "bc-minecraft-bedrock-types";
import { Definition } from "bc-minecraft-bedrock-types/lib/src/types/definition";
import { EntityAnimationMolangCarrier } from "../../Types";

export function animation_or_controller_diagnose_implementation(
  id: string,
  user: EntityAnimationMolangCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder,
  particles?: Definition,
  sounds?: Definition
): void {
  switch (is_animation_or_controller(id, diagnoser)) {
    case anim_or_contr.animation:
      return animation_diagnose_implementation(id, user, ownerType, diagnoser, particles, sounds);

    case anim_or_contr.controller:
      return animation_controller_diagnose_implementation(id, user, ownerType, diagnoser, { particles, sounds });

    case anim_or_contr.neither:
      diagnoser.add(
        id,
        `Cannot find animation / animation controller: ${id}`,
        DiagnosticSeverity.error,
        "resourcepack.anim_or_controller.missing"
      );
  }
}

export function animation_or_controller_diagnose(id: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  switch (is_animation_or_controller(id.text, diagnoser)) {
    case anim_or_contr.controller:
    case anim_or_contr.animation:
      return;

    case anim_or_contr.neither:
      diagnoser.add(
        id,
        `Cannot find animation / animation controller: ${id}`,
        DiagnosticSeverity.error,
        "resourcepack.anim_or_controller.missing"
      );
      return;
  }
}

export function animation_reference_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const data = diagnoser.context.getCache();
  const id = value.text;

  //Project in entity
  if (data.ResourcePacks.entities.find((entity) => entity.animations.defined.includes(id)) !== undefined) {
    return;
  }
  if (data.ResourcePacks.animations.find((anim) => anim.id === id) !== undefined) {
    return;
  }
  if (data.ResourcePacks.animation_controllers.find((anim) => anim.id === id) !== undefined) {
    return;
  }

  //Vanilla?
  if (MinecraftData.vanilla.ResourcePack.entities.some((entity) => entity.animations.includes(id))) {
    return;
  }
  if (MinecraftData.vanilla.ResourcePack.animations.some((anim) => anim.id === id)) {
    return;
  }
  if (MinecraftData.vanilla.ResourcePack.animation_controllers.some((anim) => anim.id === id)) {
    return;
  }

  diagnoser.add(
    value,
    `Cannot find animation / animation controller: ${value.text}`,
    DiagnosticSeverity.error,
    "resourcepack.anim_or_controller.missing"
  );
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
