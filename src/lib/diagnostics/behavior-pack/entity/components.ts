import { Internal } from "bc-minecraft-bedrock-project";
import { ComponentContainer } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Context } from "../../../utility/components";
import { behaviorpack_diagnose_entity_components } from "./components/diagnose";

export function behaviorpack_entity_components_check(
  entity: Internal.BehaviorPack.Entity,
  context: Context<Internal.BehaviorPack.Entity>,
  diagnoser: DocumentDiagnosticsBuilder
) {
  const desc = entity["minecraft:entity"];

  behaviorpack_entity_componentscontainer_check(desc.components, context, diagnoser);

  if (desc.component_groups === undefined) return;

  const groups = Object.getOwnPropertyNames(desc.component_groups);

  for (let I = 0; I < groups.length; I++) {
    const group = groups[I];
    behaviorpack_entity_componentscontainer_check(desc.component_groups[group], context, diagnoser);
  }
}

function behaviorpack_entity_componentscontainer_check(
  container: ComponentContainer | undefined | null,
  context: Context<Internal.BehaviorPack.Entity>,
  diagnoser: DocumentDiagnosticsBuilder
) {
  if (container === null || typeof container !== "object") return;

  behaviorpack_diagnose_entity_components(container, context, diagnoser);
}
