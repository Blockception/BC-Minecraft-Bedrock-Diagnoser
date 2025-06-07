import { Definition } from "bc-minecraft-bedrock-types/lib/types/definition";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { MolangDataSetKey } from "bc-minecraft-molang";
import { forEach } from "../../../utility/using-defined";
import { education_enabled } from "../../definitions";
import { EntityAnimationMolangCarrier, DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { general_animation_controllers_implementation } from "../../minecraft/animation-controllers";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  controllerid: string,
  user: EntityAnimationMolangCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder,
  definitions: {
    particles?: Definition;
    sounds?: Definition;
  }
): void {
  if (!has_animation_controller(controllerid, diagnoser)) return;

  const controller = diagnoser.context.getProjectData().projectData.resourcePacks.animation_controllers.get(controllerid);
  if (!controller) return;

  general_animation_controllers_implementation(controller, user, ownerType, diagnoser);

  //Particle check
  const particles = definitions.particles || {};
  forEach(controller.particles, (particle) => {
    if (particles[particle] !== undefined) return;

    diagnoser.add(
      `animations/${controllerid}`,
      `Animation controller: ${controllerid} uses particle: '${particle}', but no definition has been found`,
      DiagnosticSeverity.warning,
      "resourcepack.particle.missing"
    );
  });

  //Sound check
  const sounds = definitions.sounds || {};
  forEach(controller.sounds, (sound) => {
    if (sounds[sound] !== undefined) return;

    diagnoser.add(
      `animations/${controllerid}`,
      `Animation controller: ${controllerid} uses sound: '${sound}', but no definition has been found`,
      DiagnosticSeverity.warning,
      "resourcepack.sound.missing"
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
  const cache = diagnoser.context.getProjectData().projectData;

  //Project has animation controller
  if (cache.resourcePacks.animation_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has animation controller
  if (MinecraftData.ResourcePack.hasAnimationController(id, edu)) return true;

  //Nothing then report error
  diagnoser.add(
    `"${id}"`,
    `Cannot find resourcepack animation controller: ${id}`,
    DiagnosticSeverity.error,
    "resourcepack.animation_controller.missing"
  );
  return false;
}
