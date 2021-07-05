import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";

export function entity_resourcepack_check(identifier: string, diagnoser: DiagnosticsBuilder) {
  //Check if the resourcepack has the same entity
  if (!diagnoser.context.cache.ResourcePacks.entities.has(identifier)) {
    diagnoser.Add(0, `Missing a resourcepack definition of the entity: '${identifier}'`, DiagnosticSeverity.error, "resourcepack.entity.missing");
  }
}
