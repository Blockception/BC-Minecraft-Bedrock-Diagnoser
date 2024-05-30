import { components_dependencies, Context, DependedMap } from "../../../../Utility/components";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../Types";
import { Internal } from "bc-minecraft-bedrock-project";

//Map of components that are depended on all other specified components
const component_dependents_all: DependedMap = {
  "minecraft:addrider": ["minecraft:rideable"],
  "minecraft:behavior.admire_item": ["minecraft:admire_item"],
  "minecraft:behavior.barter": ["minecraft:barter"],
  "minecraft:behavior.controlled_by_player": ["minecraft:movement", "minecraft:rideable"],
  "minecraft:behavior.drop_item_for": [/^minecraft:navigation.*/gim],
  "minecraft:behavior.leap_at_target": [/^minecraft:behavior.*target.*/gim],
  "minecraft:behavior.slime_attack": ["minecraft:attack"],
  "minecraft:behavior.stalk_and_pounce_on_target": ["minecraft:attack"],
  "minecraft:breedable": ["minecraft:behavior.breed"],
};

//Map of components that are depended on one of the other specified components
const component_dependents_any: DependedMap = {
  "minecraft:behavior.slime_attack": [
    "minecraft:behavior.nearest_attackable_target",
    "minecraft:behavior.hurt_by_target",
  ],
  "minecraft:behavior.stalk_and_pounce_on_target": [
    "minecraft:behavior.nearest_attackable_target",
    "minecraft:behavior.hurt_by_target",
  ],
  "minecraft:giveable": ["minecraft:inventory"],
};

/**Checks if components dependencies are present, a component might need others to be present
 * @param entity The entity to check
 * @param entity The needed context
 * @param diagnoser The diagnoser to report to*/
export function behaviorpack_entity_components_dependencies(
  entity: Internal.BehaviorPack.Entity,
  context: Context,
  diagnoser: DiagnosticsBuilder
): void {
  const components = context.components;

  checkMovements(diagnoser, components, entity);

  components_dependencies("entity", context, diagnoser, component_dependents_all, component_dependents_any);
}

export function checkMovements(diagnoser: DiagnosticsBuilder, components: string[], entity: Internal.BehaviorPack.Entity): void {
  const movementComps = components.filter((comp) => comp.startsWith("minecraft:movement."));
  const navigationComps = components.filter((comp) => comp.startsWith("minecraft:navigation."));
  const runtimeId = entity['minecraft:entity'].description.runtime_identifier || ''

  // Check for dolphin runtime
  if (movementComps.length === 1 && runtimeId === 'minecraft:dolphin') {
    diagnoser.add(
      "runtime_identifier",
      `Entity runtime 'minecraft:dolphin' is not compatible with ${movementComps[0]}`,
      DiagnosticSeverity.error,
      "behaviorpack.entity.component.incompatible_runtime"
    )
  }

  // Check for glide
  if (movementComps.length === 1 && movementComps.includes("minecraft:movement.glide")) {
    return;
  }

  // If we have nothing to check, then we can return
  if (movementComps.length == 0 && navigationComps.length == 0) {
    return;
  }

  if (movementComps.length === 0 && (runtimeId === 'minecraft:ghast' || runtimeId === 'minecraft:dolphin')) return;

  // Accounting for ghastruntime
  if (movementComps.length === 0) {
    diagnoser.add(
      "minecraft:movement",
      `Missing a movement component such as: 'minecraft:movement.basic'`,
      DiagnosticSeverity.error,
      "behaviorpack.entity.component.missing"
    );
  }
  if (navigationComps.length === 0) {
    diagnoser.add(
      "minecraft:movement",
      `Missing a movement component such as: 'minecraft:navigation.generic'`,
      DiagnosticSeverity.error,
      "behaviorpack.entity.component.missing"
    );
  }
}
