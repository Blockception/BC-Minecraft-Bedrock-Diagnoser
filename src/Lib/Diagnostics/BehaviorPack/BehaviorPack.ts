import { FileType } from "bc-minecraft-bedrock-project/lib/src/project/behavior-pack";
import { DocumentDiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";

import * as AnimationController from "./Animation Controllers/entry";
import * as Animation from "./Animation/entry";
import * as Block from "./Block/entry";
import * as Entity from "./Entity/entry";
import * as Tick from "./Functions/Tick/entry";
import * as Item from "./Item/entry";
import * as LootTable from "./Loot Table/entry";
import * as Manifest from "./Manifest/entry";
import * as Mcfunction from "./Mcfunction/entry";
import * as Script from "./Script/entry";
import * as SpawnRule from "./Spawn Rule/entry";
import * as Structure from "./Structure/entry";
import * as Trading from "./Trading/entry";
import * as Feature from "./Feature/entry";

export namespace BehaviorPack {
  /**Processes and diagnoses the given textdocument
   * @param doc The document to process / diagnose
   * @param diagnoser The diagnoser to report to
   * @returns `true` or `false` whenever or not it was successful*/
  export function Process(diagnoser: DocumentDiagnosticsBuilder): boolean {
    const uri = diagnoser.document.uri;

    //retrieve filter doc type
    const type = FileType.detect(uri);

    switch (type) {
      case FileType.animation:
        Animation.Diagnose(diagnoser);
        break;

      case FileType.animation_controller:
        AnimationController.Diagnose(diagnoser);
        break;

      case FileType.block:
        Block.Diagnose(diagnoser);
        break;

      case FileType.entity:
        Entity.Diagnose(diagnoser);
        break;

      case FileType.function:
        if (uri.endsWith("tick.json")) {
          Tick.Diagnose(diagnoser);
        } else {
          Mcfunction.Diagnose(diagnoser);
        }
        break;

      case FileType.item:
        Item.Diagnose(diagnoser);
        break;

      case FileType.loot_table:
        LootTable.Diagnose(diagnoser);
        break;

      case FileType.manifest:
        Manifest.Diagnose(diagnoser);
        break;

      case FileType.script:
        Script.Diagnose(diagnoser);
        break;

      case FileType.spawn_rule:
        SpawnRule.Diagnose(diagnoser);
        break;

      case FileType.structure:
        Structure.Diagnose(diagnoser);
        break;

      case FileType.trading:
        Trading.Diagnose(diagnoser);
        break;

      case FileType.feature:
        Feature.Diagnose(diagnoser);
        break;

      default:
      case FileType.unknown:
        return false;
    }

    return true;
  }
}
