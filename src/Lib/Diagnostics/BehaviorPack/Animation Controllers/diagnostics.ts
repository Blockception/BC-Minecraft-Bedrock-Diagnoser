import { MolangDataSetKey } from "bc-minecraft-molang";
import { DiagnosticsBuilder, DiagnosticSeverity, EntityAnimationMolangCarrier, EventCarrier } from "../../../Types";
import { general_animation_controllers_implementation } from "../../Minecraft/Animation Controllers";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  controllerId: string,
  user: EntityAnimationMolangCarrier & EventCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  if (has_animation_controller(controllerId, diagnoser)) {
    const controller = diagnoser.context.getCache().behaviorPacks.animation_controllers.get(controllerId);

    if (!controller) return;

    general_animation_controllers_implementation(controller, user, ownerType, diagnoser);
  }
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
  if (cache.behaviorPacks.animation_controllers.has(id)) return true;

  //Nothing then report error
  diagnoser.add(
    `"${id}"`,
    `Cannot find behaviorpack animation_controller: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.animation_controller.missing"
  );
  return false;
}
