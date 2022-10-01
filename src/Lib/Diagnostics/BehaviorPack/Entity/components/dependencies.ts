import { Context } from "./context";
import { DiagnosticsBuilder, DiagnosticSeverity, hasPattern } from "../../../../Types";
import { Internal } from "bc-minecraft-bedrock-project";

type Depended = string | RegExp;
type DependedMap = Record<string, Depended[]>;

//Map of components that are depended on all other specified components
const component_dependents_all: DependedMap = {
  "minecraft:addrider": ["minecraft:rider"],
  "minecraft:behavior.admire_item": ["minecraft:admire_item"],
  "minecraft:behavior.barter": ["minecraft:barter"],
  "minecraft:behavior.controlled_by_player": ["minecraft:movement", "minecraft:rideable"],
  "minecraft:behavior.drop_item_for": [/$minecraft:nagivation.*/gim],
  "minecraft:behavior.leap_at_target": [/$minecraft:behavior.*target.*/gim],
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

  //Loop through all the components that depend on all other components
  for (const [component, deps] of Object.entries(component_dependents_all)) {
    checkAll(diagnoser, context.components, component, ...deps);
  }

  //Loop through all the components that depend on any other components
  for (const [component, deps] of Object.entries(component_dependents_any)) {
    checkAny(diagnoser, context.components, component, ...deps);
  }
}

/**The component needs all of the specified needs
 * @param diagnoser
 * @param dependent The component group that is depended on other groups
 * @param needs
 * @param components The list of used components
 * @returns
 */
function checkAll(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: Depended[]): void {
  //Check if the entity has the component
  if (!components.includes(dependent)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    //If any fails then report
    if (!isMatch(need, components)) {
      diagnoser.Add(
        dependent,
        `Component: '${dependent}' requires a ${need} component to be present`,
        DiagnosticSeverity.error,
        "behaviorpack.entity.component.missing"
      );
    }
  }
}

/**The component needs one of the specified needs
 * @param diagnoser
 * @param dependent The component group that is depended on other groups
 * @param needs
 * @param components The list of used components
 * @returns
 */
function checkAny(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: Depended[]): void {
  //Check if the entity has the component
  if (!components.includes(dependent)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    //Has the component, then exit
    if (isMatch(need, components)) return;
  }

  diagnoser.Add(
    dependent,
    `Component: '${dependent}' requires one of the following components: '${JSON.stringify(
      needs.map((n) => n.toString()).join(",")
    )}'`,
    DiagnosticSeverity.error,
    "behaviorpack.entity.component.missing"
  );
}

function checkPatternAny(
  diagnoser: DiagnosticsBuilder,
  components: string[],
  dependent: string,
  ...needs: string[]
): void {
  if (!hasPattern(dependent, components)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    if (!hasPattern(need, components)) {
      diagnoser.Add(
        dependent,
        `Component that follows pattern: '${dependent}' requires one of the following components that follows the pattern(s): ${JSON.stringify(
          needs.join(",")
        )}`,
        DiagnosticSeverity.error,
        "behaviorpack.entity.component.missing"
      );
    }
  }
}

function checkMovements(diagnoser: DiagnosticsBuilder, components: string[]): void {
  const hasMovement = hasPattern("minecraft:movement.", components) ? 1 : 0;
  const hasNavigation = hasPattern("minecraft:navigation.", components) ? 1 : 0;

  const Count = hasMovement + hasNavigation;

  if (Count > 0 && Count != 2) {
    if (hasMovement == 0)
      diagnoser.Add(
        "minecraft:movement",
        `Missing a movement component such as: 'minecraft:movement.basic'`,
        DiagnosticSeverity.error,
        "behaviorpack.entity.component.missing"
      );
    if (hasNavigation == 0)
      diagnoser.Add(
        "minecraft:movement",
        `Missing a movement component such as: 'minecraft:navigation.generic'`,
        DiagnosticSeverity.error,
        "behaviorpack.entity.component.missing"
      );
  }
}

function isMatch(needs: Depended, components: string[]): boolean {
  if (typeof needs === "string") return components.includes(needs);

  return components.findIndex((c) => needs.test(c)) !== -1;
}
