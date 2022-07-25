import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../../../main";
import { minecraft_diagnose_filters } from "../../../Minecraft/Filter/diagnose";

export function behaviorpack_entity_components_filters(container: Internal.BehaviorPack.EntityComponentContainer, diagnoser: DiagnosticsBuilder) {
  const component_keys = Object.getOwnPropertyNames(container);

  component_keys.forEach((key) => {
    const component = container[key];

    if (typeof component === "object") {
      const properties = Object.getOwnPropertyNames(component);

      properties.forEach((property_key) => {
        const property = component[property_key];

        if (typeof property === "object" && property_key.includes("filter")) {
          minecraft_diagnose_filters(component, diagnoser);
        }
      });
    }
  });
}
