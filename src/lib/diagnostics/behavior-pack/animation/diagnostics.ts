import { ProjectItem } from "bc-minecraft-bedrock-project";
import { MolangDataSetKey } from "bc-minecraft-molang";
import { Errors } from "../..";
import { DiagnosticsBuilder, DiagnosticSeverity, EntityAnimationMolangCarrier, EventCarrier } from "../../../types";
import { diagnose_molang_implementation } from "../../molang/diagnostics";

type User = EntityAnimationMolangCarrier & EventCarrier;

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function diagnose_animation_implementation(
  anim_id: string,
  user: User,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  //Project has animation
  const anim = diagnoser.context.getProjectData().behaviors.animations.get(anim_id, diagnoser.project);
  if (anim === undefined) {
    return Errors.missing("behaviors", "animations", anim_id, diagnoser);
  }
  if (!ProjectItem.is(anim)) {
    return; // Skip anything but a project defined item
  }

  const entityEvents = diagnoser.context.getProjectData().projectData.behaviorPacks.entities.get(user.id)?.events
  anim.item.events.forEach(id => {
    if (!entityEvents?.includes(id)) diagnoser.add(`${user.id}/${anim.item.id}`, `Entity does not have event ${id}`, DiagnosticSeverity.warning, "behaviorpack.entity.event.missing")
  })

  diagnose_molang_implementation(anim.item, user, ownerType, diagnoser);
}
