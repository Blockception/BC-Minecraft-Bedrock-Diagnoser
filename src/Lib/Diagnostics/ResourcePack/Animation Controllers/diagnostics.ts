import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { education_enabled } from "../../Definitions";
import { OwnerType } from "../../Molang/diagnostics";
import { general_animation_controllers_implementation } from "../../Minecraft/Animation Controllers";
import { Definition } from "bc-minecraft-bedrock-types/lib/src/Types/Definition";
import { EntityAnimationMolangCarrier } from '../../../Types';

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  controllerid: string,
  user: EntityAnimationMolangCarrier,
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder,
  particles?: Definition,
  sounds?: Definition
): void {
  if (!has_animation_controller(controllerid, diagnoser)) return;
  const controller = diagnoser.context.getCache().ResourcePacks.animation_controllers.get(controllerid);

  if (!controller) return;
  general_animation_controllers_implementation(controller, user, ownerType, diagnoser);

  //Particle check
  controller.particles.using.forEach((particle) => {
    if (particles && particles[particle] !== undefined) return;

    diagnoser.Add(
      `animations/${controllerid}`,
      `Animation controller: ${controllerid} uses particle: '${particle}', but no definition has been found`,
      DiagnosticSeverity.warning,
      "resourcepack.animation_controller.particle.missing"
    );
  });

  //Sound check
  controller.sounds.using.forEach((sound) => {
    if (sounds && sounds[sound] !== undefined) return;

    diagnoser.Add(
      `animations/${controllerid}`,
      `Animation controller: ${controllerid} uses sound: '${sound}', but no definition has been found`,
      DiagnosticSeverity.warning,
      "resourcepack.animation_controller.sound.missing"
    );
  });
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
  if (cache.ResourcePacks.animation_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has animation controller
  if (MinecraftData.ResourcePack.hasAnimationController(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(
    `"${id}"`,
    `Cannot find resourcepack animation controller: ${id}`,
    DiagnosticSeverity.error,
    "resourcepack.animation_controller.missing"
  );
  return false;
}
