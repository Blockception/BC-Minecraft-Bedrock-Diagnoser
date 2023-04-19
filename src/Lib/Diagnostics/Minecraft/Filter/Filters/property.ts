import { Minecraft } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../../../Types";
import { diagnose_entity_property_usage } from "../../../BehaviorPack/Entity/properties";

export function diagnose_filter_property(filter: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) {
  const { test, domain, value } = filter;

  const entities = diagnoser.context.getCache().BehaviorPacks.entities;
  entities.forEach((entity) => {
    if (entity.properties) {
      const property = entity.properties.find((property) => property.name === domain);
      if (property) {
        diagnose_entity_property_usage([property], test, value as string | number | boolean, diagnoser);
      }
    }
  });
}
