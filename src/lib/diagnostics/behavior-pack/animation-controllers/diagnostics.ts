import { AnimationCarrier, ProjectItem, References } from "bc-minecraft-bedrock-project";
import { Errors } from "../..";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { general_animation_controllers_implementation } from "../../minecraft/animation-controllers";
import { User } from '../../molang';

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function diagnose_animation_controller_implementation(
  user: User & Partial<AnimationCarrier<References>>,
  id: string,
  diagnoser: DiagnosticsBuilder
): void {
  //Project has animation controller
  const anim = diagnoser.context.getProjectData().behaviors.animation_controllers.get(id, diagnoser.project);
  if (anim === undefined) {
    return Errors.missing("behaviors", "animation_controllers", id, diagnoser);
  }
  if (!ProjectItem.is(anim)) {
    return; // Skip anything but a project defined item
  }

  const entityEvents = diagnoser.context.getProjectData().projectData.behaviorPacks.entities.get(user.id)?.events;
  anim.item.events.forEach(id => {
    if (!entityEvents?.includes(id)) diagnoser.add(`${user.id}/${anim.item.id}`, `Entity does not have event ${id}`, DiagnosticSeverity.warning, "behaviorpack.entity.event.missing");
  });

  general_animation_controllers_implementation(user, anim.item, diagnoser);
}
