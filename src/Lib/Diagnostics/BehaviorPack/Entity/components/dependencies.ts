import { components_dependencies, Context, DependedMap } from "../../../../Utility/components";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../Types";
import { hasPattern } from '../../../../Utility/Checks';
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
  checkMovements(diagnoser, components);

  components_dependencies("entity", context, diagnoser, component_dependents_all, component_dependents_any);
}

function checkMovements(diagnoser: DiagnosticsBuilder, components: string[]): void {
  const hasMovement = hasPattern("minecraft:movement.", components) ? 1 : 0;
  const hasNavigation = hasPattern("minecraft:navigation.", components) ? 1 : 0;

  const Count = hasMovement + hasNavigation;

  if (Count > 0 && Count != 2) {
    if (hasMovement == 0)
      diagnoser.add(
        "minecraft:movement",
        `Missing a movement component such as: 'minecraft:movement.basic'`,
        DiagnosticSeverity.error,
        "behaviorpack.entity.component.missing"
      );
    if (hasNavigation == 0)
      diagnoser.add(
        "minecraft:movement",
        `Missing a movement component such as: 'minecraft:navigation.generic'`,
        DiagnosticSeverity.error,
        "behaviorpack.entity.component.missing"
      );
  }
}
