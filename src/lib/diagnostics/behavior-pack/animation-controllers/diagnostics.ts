import { MolangDataSetKey } from "bc-minecraft-molang";
import { DiagnosticsBuilder, DiagnosticSeverity, EntityAnimationMolangCarrier, EventCarrier } from "../../../types";
import { general_animation_controllers_implementation } from "../../minecraft/animation-controllers";
import { Errors } from "../..";
import { ProjectItem } from "bc-minecraft-bedrock-project";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  id: string,
  user: EntityAnimationMolangCarrier & EventCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  //Project has animation
  const anim = diagnoser.context.getProjectData().behaviors.animation_controllers.get(id, diagnoser.project);
  if (anim === undefined) {
    return Errors.missing("behaviors", "animation_controllers", id, diagnoser);
  }
  if (!ProjectItem.is(anim)) {
    return; // Skip anything but a project defined item
  }

  general_animation_controllers_implementation(anim.item, user, ownerType, diagnoser);
}
