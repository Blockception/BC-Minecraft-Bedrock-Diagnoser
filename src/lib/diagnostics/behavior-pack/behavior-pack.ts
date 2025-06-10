import { FileType } from "bc-minecraft-bedrock-project/lib/src/project/behavior-pack";
import { DocumentDiagnosticsBuilder } from "../../types/diagnostics-builder";

import * as AnimationController from "./animation-controllers/entry";
import * as Animation from "./animation/entry";
import * as Block from "./block/entry";
import * as Entity from "./entity/entry";
import * as FeatureRule from "./feature-rule/entry";
import * as Feature from "./feature/entry";
import * as Tick from "./functions/tick/entry";
import * as Item from "./item/entry";
import * as ItemCatalog from "./item-catalog/entry";
import * as LootTable from "./loot-table/entry";
import * as Manifest from "./manifest/entry";
import * as Mcfunction from "./mcfunction/entry";
import * as Script from "./script/entry";
import * as SpawnRule from "./spawn-rule/entry";
import * as Structure from "./structure/entry";
import * as Trading from "./trading/entry";

export namespace BehaviorPack {
  /**
   * Processes and diagnoses the given textdocument
   * @param doc The document to process / diagnose
   * @param diagnoser The diagnoser to report to
   * @returns `true` or `false` whenever or not it was successful*/
  export function diagnose_document(diagnoser: DocumentDiagnosticsBuilder): boolean {
    //retrieve filter doc type
    const uri = diagnoser.document.uri;
    const type = FileType.detect(uri);

    switch (type) {
      case FileType.animation:
        Animation.diagnose_animation_document(diagnoser);
        break;

      case FileType.animation_controller:
        AnimationController.diagnose_animation_controller_document(diagnoser);
        break;

      case FileType.block:
        Block.diagnose_block_document(diagnoser);
        break;

      case FileType.entity:
        Entity.diagnose_entity_document(diagnoser);
        break;

      case FileType.function:
        if (uri.endsWith("tick.json")) {
          Tick.diagnose_tick_document(diagnoser);
        } else {
          Mcfunction.diagnose_mcfunction_document(diagnoser);
        }
        break;

      case FileType.item:
        Item.diagnose_item_document(diagnoser);
        break;

      case FileType.loot_table:
        LootTable.diagnose_loot_table_document(diagnoser);
        break;

      case FileType.manifest:
        Manifest.diagnose_manifest(diagnoser);
        break;

      case FileType.script:
        Script.diagnose_script_document(diagnoser);
        break;

      case FileType.spawn_rule:
        SpawnRule.diagnose_spawn_rule_document(diagnoser);
        break;

      case FileType.structure:
        Structure.diagnose_structure_document(diagnoser);
        break;

      case FileType.trading:
        Trading.diagnose_trading_document(diagnoser);
        break;

      case FileType.feature:
        Feature.diagnose_feature_document(diagnoser);
        break;

      case FileType.feature_rule:
        FeatureRule.diagnose_feature_rules_document(diagnoser);
        break;

      case FileType.item_catalog:
        ItemCatalog.diagnose_item_catalog_document(diagnoser);
        break;

      default:
      case FileType.unknown:
        return false;
    }

    return true;
  }
}
