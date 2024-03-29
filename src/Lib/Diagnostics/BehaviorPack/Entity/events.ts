import { Internal, SMap, TextDocument } from "bc-minecraft-bedrock-project";
import { ComponentGroups } from "bc-minecraft-bedrock-types/lib/src/minecraft/components";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../main";
import { behaviorpack_entity_components_filters } from "./components/filters";
import { EntityProperty } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/BehaviorPack/Entity";
import { diagnose_entity_property_usage } from "./properties";
import { commandsCheck, json_commandsCheck } from '../Mcfunction';
import { DocumentDiagnosticsBuilder } from '../../../Types';

type EntityEvent = Internal.BehaviorPack.EntityEvent;

export function behaviorpack_entity_check_events(
  events: SMap<EntityEvent> | EntityEvent[],
  diagnoser: DocumentDiagnosticsBuilder,
  properties: EntityProperty[],
  component_groups?: SMap<Internal.BehaviorPack.EntityComponentContainer>
) {
  if (Array.isArray(events)) {
    events.forEach((event) => behaviorpack_entity_check_event(event, "", diagnoser, properties, component_groups));
  } else {
    SMap.forEach(events, (event, key) =>
      behaviorpack_entity_check_event(event, key, diagnoser, properties, component_groups)
    );
  }
}

/**
 *
 * @param event
 * @param diagnoser
 * @param component_groups
 */
export function behaviorpack_entity_check_event(
  event: EntityEvent & { filters?: any },
  event_id: string,
  diagnoser: DocumentDiagnosticsBuilder,
  properties: EntityProperty[],
  component_groups?: ComponentGroups
): void {
  has_groups(diagnoser, event_id, event.add?.component_groups, component_groups);
  has_groups(diagnoser, event_id, event.remove?.component_groups, component_groups);

  event.randomize?.forEach((item) => {
    behaviorpack_entity_check_event(item, event_id, diagnoser, properties, component_groups);
  });

  event.sequence?.forEach((item) => {
    behaviorpack_entity_check_event(item, event_id, diagnoser, properties, component_groups);
  });

  behaviorpack_entity_components_filters(event, diagnoser);

  if (event.set_property) {
    for (const [key, value] of Object.entries(event.set_property)) {
      diagnose_entity_property_usage(properties, key, value, "events", diagnoser);
    }
  }

  if ((event as any)["run_command"]) {
    diagnoser.add(
      `events/${event_id}`,
      `Event is using the deprecated run_command property, use queue_command instead`,
      DiagnosticSeverity.warning,
      "behaviorpack.entity.event.run_command"
    );
  }

  if (event.queue_command) {
    const c = event.queue_command.command;
    const command = typeof c === "string" ? [c] : c;

    command.forEach((cmd) => {
      if (cmd.startsWith("/")) {
        diagnoser.add(
          `events/${event_id}/cmd`,
          `Commands in queue_command should not start with a /, remove it`,
          DiagnosticSeverity.warning,
          "behaviorpack.entity.event.queue_command"
        );

        cmd = cmd.slice(1);
      };

      commandsCheck(cmd, diagnoser);
    });
  }
  
}

function has_groups(
  diagnoser: DiagnosticsBuilder,
  id: string,
  groups?: string[],
  component_groups?: SMap<Internal.BehaviorPack.EntityComponentContainer>
): void {
  if (groups === undefined) return;

  for (let I = 0; I < groups.length; I++) {
    const group = groups[I];

    if (component_groups) {
      //If there is an item, continue
      if (component_groups[group] !== undefined) continue;
    }

    diagnoser.add(
      `events/${id}/${group}`,
      `Event is calling component group: ${group}, but the component group was not found`,
      DiagnosticSeverity.warning,
      "behaviorpack.entity.component_group.missing"
    );
  }
}
