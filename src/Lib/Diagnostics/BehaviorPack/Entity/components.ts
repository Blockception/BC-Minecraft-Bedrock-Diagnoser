import { behaviorpack_entity_components_economy_trade_table } from "./components/economy_trade_table";
import { behaviorpack_entity_components_loot } from "./components/loot";
import { behaviorpack_entity_components_trade_table } from "./components/trade";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { getUsedComponents } from "./Entity";
import { hasPattern } from "../../../Types/Checks";
import { Internal } from "bc-minecraft-bedrock-project";
import { behaviorpack_diagnose_entity_components } from "./components/diagnose";
import { Context } from "./components/context";
import { behaviorpack_entity_components_filters } from './components/filters';

/**Checks if components dependencies are present, a component might need others to be present
 * @param entity The entity to check
 * @param diagnoser The diagnoser to report to*/
export function behaviorpack_entity_components_dependencies(entity: Internal.BehaviorPack.Entity, context: Context, diagnoser: DiagnosticsBuilder) {
  const components = context.components;

  checkMovements(diagnoser, components);
  checkAll(diagnoser, components, "minecraft:addrider", "minecraft:rideable");
  checkAll(diagnoser, components, "minecraft:breedable", "minecraft:behavior.breed");

  checkAll(diagnoser, components, "minecraft:behavior.controlled_by_player", "minecraft:movement", "minecraft:rideable");
  checkAll(diagnoser, components, "minecraft:behavior.admire_item", "minecraft:admire_item");
  checkAll(diagnoser, components, "minecraft:behavior.barter", "minecraft:barter");

  //behavior.slime_attack
  checkAny(
    diagnoser,
    components,
    "minecraft:behavior.slime_attack",
    "minecraft:behavior.nearest_attackable_target",
    "minecraft:behavior.hurt_by_target"
  );
  checkAll(diagnoser, components, "minecraft:behavior.slime_attack", "minecraft:attack");

  //behavior.stalk_and_pounce_on_target
  checkAny(
    diagnoser,
    components,
    "minecraft:behavior.stalk_and_pounce_on_target",
    "minecraft:behavior.nearest_attackable_target",
    "minecraft:behavior.hurt_by_target"
  );
  checkAll(diagnoser, components, "minecraft:behavior.stalk_and_pounce_on_target", "minecraft:attack");

  //behavior.drop_item_for
  checkAny(diagnoser, components, "minecraft:behavior.drop_item_for", /$minecraft:nagivation.*/gim);
  checkAny(diagnoser, components, "minecraft:behavior.leap_at_target", /$minecraft:behavior.*target.*/gim);
}

export function behaviorpack_entity_components_check(entity: Internal.BehaviorPack.Entity, context: Context, diagnoser: DiagnosticsBuilder) {
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
  container: Internal.BehaviorPack.EntityComponentContainer | undefined | null,
  context: Context,
  diagnoser: DiagnosticsBuilder
) {
  if (container === null || typeof container !== "object") return;

  behaviorpack_entity_components_loot(container, diagnoser);
  behaviorpack_entity_components_trade_table(container, diagnoser);
  behaviorpack_entity_components_economy_trade_table(container, diagnoser);
  behaviorpack_entity_components_filters(container, diagnoser);

  behaviorpack_diagnose_entity_components(container, context, diagnoser);
}

/**The component needs all of the specified needs
 * @param diagnoser
 * @param dependent The component group that is depended on other groups
 * @param needs
 * @param components The list of used components
 * @returns
 */
function checkAll(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: string[]): void {
  //Check if the entity has the component
  if (!components.includes(dependent)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    if (!components.includes(need)) {
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
function checkAny(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: (string | RegExp)[]): void {
  //Check if the entity has the component
  if (!components.includes(dependent)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    if (typeof need === "string") {
      if (components.includes(need)) return;
    } else {
      if (components.findIndex((c) => need.test(c)) !== -1) return;
    }
  }

  diagnoser.Add(
    dependent,
    `Component: '${dependent}' requires one of the following components: ${JSON.stringify(needs)}`,
    DiagnosticSeverity.error,
    "behaviorpack.entity.component.missing"
  );
}

function checkPatternAny(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: string[]): void {
  if (!hasPattern(dependent, components)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    if (!hasPattern(need, components)) {
      diagnoser.Add(
        dependent,
        `Component that follows pattern: '${dependent}' requires one of the following components that follows the pattern(s): ${JSON.stringify(
          needs
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
