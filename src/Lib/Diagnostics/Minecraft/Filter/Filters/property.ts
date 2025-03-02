import { Minecraft } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../Types";
import { diagnose_entity_property_usage } from "../../../BehaviorPack/Entity/properties";

export function diagnose_filter_property(filter: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) {
  const { domain, value } = filter;

  if (!domain) return;

  const entities = diagnoser.context.getCache().behaviorPacks.entities;

  let diagnosed = false;
  
  entities.forEach((entity) => {
    if (entity.properties) {
      const property = entity.properties.find((property) => property.name === domain);
      if (property) {
        diagnose_entity_property_usage([property], domain, value as string | number | boolean, "filter", diagnoser);
        diagnosed = true;
      }
    }
  });

  // If no definition for it is found in any entity
  if (!diagnosed) diagnoser.add(
    `$filters/${domain}`,
    `Entity property definition for "${domain}" not found`,
    DiagnosticSeverity.error,
    "behaviorpack.entity.property.unknown_property"
  )
}
