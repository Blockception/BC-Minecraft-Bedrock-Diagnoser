import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { EntityAnimationMolangCarrier, EventCarrier } from "../../../Types/Interfaces";
import { general_animation_controllers_implementation } from "../../Minecraft/Animation Controllers";
import { MolangDataSetKey } from "bc-minecraft-molang";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  controllerid: string,
  user: EntityAnimationMolangCarrier & EventCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  if (has_animation_controller(controllerid, diagnoser)) {
    const controller = diagnoser.context.getCache().BehaviorPacks.animation_controllers.get(controllerid);

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
  if (cache.BehaviorPacks.animation_controllers.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(
    `"${id}"`,
    `Cannot find behaviorpack animation_controller: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.animation_controller.missing"
  );
  return false;
}
