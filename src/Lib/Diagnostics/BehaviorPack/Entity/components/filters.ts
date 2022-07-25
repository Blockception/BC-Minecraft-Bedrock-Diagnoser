import { DiagnosticsBuilder } from "../../../../../main";
import { minecraft_diagnose_filters } from "../../../Minecraft/Filter/diagnose";

export function behaviorpack_entity_components_filters(container: any, diagnoser: DiagnosticsBuilder) {
  traverse_object(container, diagnoser);
}

function traverse_object(object: any, diagnoser: DiagnosticsBuilder) {
  const properties = Object.getOwnPropertyNames(object);

  properties.forEach((property_key) => {
    const property = object[property_key];
    if (typeof property === "object") {
      if (property_key.includes("filter")) {
        minecraft_diagnose_filters(property, diagnoser);
      } else {
        traverse_object(property, diagnoser);
      }
    }
  });
}
