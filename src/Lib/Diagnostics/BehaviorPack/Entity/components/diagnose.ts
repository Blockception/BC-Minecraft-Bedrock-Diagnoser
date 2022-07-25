import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../../Types/DiagnosticsBuilder/include";
import { Context } from "./context";

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_entity_components(
  container: Internal.BehaviorPack.EntityComponentContainer,
  context: Context,
  diagnoser: DiagnosticsBuilder
): void {
  const keys = Object.getOwnPropertyNames(container);

  keys.forEach((key) => {
    const callbackfn = component_test[key];

    if (callbackfn) {
      callbackfn(container[key], context, diagnoser);
    }
  });
}

const component_test: { [key: string]: (component: any, context: Context, diagnoser: DiagnosticsBuilder) => void } = {

};