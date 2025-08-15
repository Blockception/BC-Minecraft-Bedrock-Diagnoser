import { ProjectItem } from "bc-minecraft-bedrock-project";
import { Errors } from "../..";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { diagnose_molang_implementation, User } from "../../molang/diagnostics";
import { filter_not_defined } from '../../resources/using';


/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function diagnose_animation_implementation(
  id: string,
  user: User,
  diagnoser: DiagnosticsBuilder
): void {
  //Project has animation
  const anim = diagnoser.context.getProjectData().behaviors.animations.get(id, diagnoser.project);
  if (anim === undefined) {
    return Errors.missing("behaviors", "animations", id, diagnoser);
  }
  if (!ProjectItem.is(anim)) {
    return; // Skip anything but a project defined item
  }

  diagnose_molang_implementation(user, anim.item, diagnoser);

  // Check if entity events are defined
  const entityEvents = diagnoser.context.getProjectData().projectData.behaviorPacks.entities.get(user.id)?.events;
  for (const undef of filter_not_defined(anim.item.events, entityEvents)) {
    diagnoser.add(
      `${user.id}/${anim.item.id}`,
      `Entity does not have event ${undef}`,
      DiagnosticSeverity.warning,
      "behaviorpack.entity.event.missing"
    );
  }

}
