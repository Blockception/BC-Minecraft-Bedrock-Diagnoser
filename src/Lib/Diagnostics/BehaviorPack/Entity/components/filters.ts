import { ComponentBehavior, ComponentContainer } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Components";
import { DiagnosticsBuilder } from "../../../../../main";
import { minecraft_diagnose_filters } from "../../../Minecraft/Filter/diagnose";

export function behaviorpack_entity_components_filters(
  container: ComponentBehavior | undefined,
  diagnoser: DiagnosticsBuilder
) {
  if (container === undefined) return;

  if (container.components) {
    traverse_object(container.components, diagnoser);
  }

  if (container.component_groups) {
    Object.values(container.component_groups).forEach((group) => {
      traverse_object(group, diagnoser);
    });
  }
}

function traverse_object(data: ComponentContainer, diagnoser: DiagnosticsBuilder) {
  const properties = Object.getOwnPropertyNames(data);

  properties.forEach((property_key) => {
    const property = data[property_key];
    if (typeof property === "object") {
      if (property_key.includes("filter")) {
        minecraft_diagnose_filters(property, diagnoser);
      } else {
        traverse_object(property, diagnoser);
      }
    }
  });
}
