import { Internal } from 'bc-minecraft-bedrock-project';
import { Json } from '../../json';
import { DocumentDiagnosticsBuilder } from "../../../types";
import { behaviorpack_entityid_diagnose } from '../entity';
import { Context } from "../../../utility/components";
import { behaviorpack_diagnose_spawnrule_components } from './components';

/**
 * Diagnoses the given document as an spawn rule
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors
 */
export function diagnose_spawn_rule_document(diagnoser: DocumentDiagnosticsBuilder): void {
  const rule = Json.LoadReport<Internal.BehaviorPack.SpawnRule>(diagnoser);
  if (!Internal.BehaviorPack.SpawnRule.is(rule)) return;

  behaviorpack_entityid_diagnose(rule['minecraft:spawn_rules'].description.identifier, diagnoser);

  rule['minecraft:spawn_rules'].conditions.forEach(data => {
    const out: string[] = [];

    Object.getOwnPropertyNames(data).forEach((c) => {
      if (!out.includes(c)) out.push(c);
    });

    const context: Context<Internal.BehaviorPack.SpawnRule> = {
      source: rule,
      components: out,
    };

    behaviorpack_diagnose_spawnrule_components(data, context, diagnoser);
  })

}