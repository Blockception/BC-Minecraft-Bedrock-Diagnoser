import { ComponentBehavior } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../../Types";
import { Context } from "../../../../utility/components";
import { ComponentCheck, components_check } from "../../../../utility/components/checks";
import { behaviorpack_entity_components_filters } from './filters';
import { check_loot_table } from "./loot";
import { check_trade_table } from "./trade";
import { Internal } from 'bc-minecraft-bedrock-project';
import { FormatVersion } from 'bc-minecraft-bedrock-types/lib/minecraft';

/**
 *
 * @param container
 * @param context
 * @param diagnoser
 */
export function behaviorpack_diagnose_entity_components(
  container: ComponentBehavior,
  context: Context<Internal.BehaviorPack.Entity>,
  diagnoser: DocumentDiagnosticsBuilder
): void {
  components_check(container, context, diagnoser, component_test);

  behaviorpack_entity_components_filters(container, diagnoser);
}

const component_test: Record<string, ComponentCheck<Internal.BehaviorPack.Entity>> = {
  "minecraft:economy_trade_table": check_trade_table,
  "minecraft:equipment": check_loot_table,
  "minecraft:loot": check_loot_table,
  "minecraft:trade_table": check_trade_table,
  "minecraft:input_air_controlled": (name, component, context, diagnoser) => {
    if (!(context.source as any).use_beta_features) diagnoser.add(name, 
      `This component requires "use_beta_features" to be set to true`,
      DiagnosticSeverity.error,
      `behaviorpack.entity.component.requires_beta_features`
    )
  },
  "minecraft:fall_damage": (name, component, context, diagnoser) => {
    try {
    const version = FormatVersion.parse(context.source.format_version);
    if (version[0] > 1 || (version[0] === 1 && version[1] > 10) || (version[0] === 1 && version[1] === 10 && version[2] > 0)) diagnoser.add(name,
      `To use "minecraft:fall_damage", you need a "format_version" of 1.10.0 or lesser`,
      DiagnosticSeverity.error,
      'behaviorpack.entity.component.fall_damage')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Leaving this empty as the base diagnoser should already flag an invalid format version
    }
  }
};
