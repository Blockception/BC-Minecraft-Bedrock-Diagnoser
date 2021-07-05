import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { hasPattern } from "../../../Types/Patterns/Checks";
import { getUsedComponents } from "./Entity";

export function entity_behaviorpack_components_dependencies(entity: Internal.BehaviorPack.Entity, diagnoser: DiagnosticsBuilder) {
  const components = getUsedComponents(entity);

  checkMovements(diagnoser, components);
  checkAll(diagnoser, components, "minecraft:addrider", "minecraft:rideable");
  checkAll(diagnoser, components, "minecraft:breedable", "minecraft:behavior.breed");

  checkAll(diagnoser, components, "minecraft:behavior.admire_item", "minecraft:admire_item");
}

/**
 *
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
      diagnoser.Add(dependent, `Component: '${dependent}' requires a ${need} component to be present`, DiagnosticSeverity.error, "entity.component.missing");
    }
  }
}

/**
 *
 * @param diagnoser
 * @param dependent The component group that is depended on other groups
 * @param needs
 * @param components The list of used components
 * @returns
 */
function checkAny(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: string[]): void {
  //Check if the entity has the component
  if (!components.includes(dependent)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    if (!components.includes(need)) {
      diagnoser.Add(
        dependent,
        `Component: '${dependent}' requires one of the following components: ${JSON.stringify(needs)}`,
        DiagnosticSeverity.error,
        "entity.component.missing"
      );
    }
  }
}

function checkPatternAny(diagnoser: DiagnosticsBuilder, components: string[], dependent: string, ...needs: string[]): void {
  if (!hasPattern(dependent, components)) return;

  for (let I = 0; I < needs.length; I++) {
    const need = needs[I];

    if (!hasPattern(need, components)) {
      diagnoser.Add(
        dependent,
        `Component that follows pattern: '${dependent}' requires one of the following components that follows the pattern(s): ${JSON.stringify(needs)}`,
        DiagnosticSeverity.error,
        "entity.component.missing"
      );
    }
  }
}

function checkMovements(diagnoser: DiagnosticsBuilder, components: string[]): void {
  const hasMovement = hasPattern("minecraft:movement.", components) ? 1 : 0;
  const hasNavigation = hasPattern("minecraft:movement.", components) ? 1 : 0;

  const hasBaseMovement = components.includes("minecraft:movement") ? 1 : 0;
  const Count = hasMovement + hasNavigation + hasBaseMovement;

  if (Count > 0 && Count != 3) {
    if (hasMovement == 0)
      diagnoser.Add("minecraft:movement", `Missing a movement component such as: 'minecraft:movement.basic'`, DiagnosticSeverity.error, "entity.component.missing");
    if (hasNavigation == 0)
      diagnoser.Add("minecraft:movement", `Missing a movement component such as: 'minecraft:navigation.generic'`, DiagnosticSeverity.error, "entity.component.missing");
    if (hasBaseMovement == 0)
      diagnoser.Add(
        "components",
        `Navigation and movement has been specified, but the following base component is missing: 'minecraft:movement'`,
        DiagnosticSeverity.error,
        "entity.component.missing.minecraft:movement"
      );
  }
}
