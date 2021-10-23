import { Internal, Map } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../main";

export function behaviorpack_entity_check_events(
  events: Map<Internal.BehaviorPack.EntityEvent> | Internal.BehaviorPack.EntityEvent[],
  diagnoser: DiagnosticsBuilder,
  component_groups?: Map<Internal.BehaviorPack.EntityComponentContainer>
) {
  if (Array.isArray(events)) {
    events.forEach((event) => behaviorpack_entity_check_event(event, "", diagnoser, component_groups));
  } else {
    Map.forEach(events, (event, key) => behaviorpack_entity_check_event(event, key, diagnoser, component_groups));
  }
}

/**
 *
 * @param event
 * @param diagnoser
 * @param component_groups
 */
export function behaviorpack_entity_check_event(
  event: Internal.BehaviorPack.EntityEvent,
  event_id: string,
  diagnoser: DiagnosticsBuilder,
  component_groups?: Map<Internal.BehaviorPack.EntityComponentContainer>
): void {
  has_groups(diagnoser, event_id, event.add?.component_groups, component_groups);
  has_groups(diagnoser, event_id, event.remove?.component_groups, component_groups);

  event.randomize?.forEach((item) => {
    behaviorpack_entity_check_event(item, event_id, diagnoser, component_groups);
  });

  event.sequence?.forEach((item) => {
    behaviorpack_entity_check_event(item, event_id, diagnoser, component_groups);
  });
}

function has_groups(
  diagnoser: DiagnosticsBuilder,
  id: string,
  groups?: string[],
  component_groups?: Map<Internal.BehaviorPack.EntityComponentContainer>
): void {
  if (groups === undefined) return;

  for (let I = 0; I < groups.length; I++) {
    const group = groups[I];

    if (component_groups) {
      //If there is an item, continue
      if (component_groups[group] !== undefined) continue;
    }

    diagnoser.Add(
      `events/${id}/${group}`,
      `Event is calling component group: ${group}, but the component group was not found`,
      DiagnosticSeverity.warning,
      "behaviorpack.entity.component_group.missing"
    );
  }
}
