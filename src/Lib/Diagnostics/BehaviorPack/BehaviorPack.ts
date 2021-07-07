import { TextDocument } from "bc-minecraft-bedrock-project";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/BehaviorPack/include";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

import * as Animation from "./Animation/entry";
import * as AnimationController from "./Animation Controller/entry";
import * as Block from "./Block/entry";
import * as Entity from "./Entity/entry";
import * as Mcfunction from "./Mcfunction/entry";
import * as Item from "./Item/entry";
import * as LootTable from "./Loot Table/entry";
import * as Manifest from "./Manifest/entry";
import * as Script from "./Script/entry";
import * as SpawnRule from "./Spawn Rule/entry";
import * as Structure from "./Structure/entry";
import * as Trading from "./Trading/entry";

export namespace BehaviorPack {
  /**Processes and diagnoses the given textdocument
   * @param doc The document to process / diagnose
   * @param diagnoser The diagnoser to report to
   * @returns `true` or `false` whenever or not it was succesfull*/
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): boolean {
    //retrieve filter doc type
    const Type = FileType.detect(doc.uri);

    switch (Type) {
      case FileType.animation:
        Animation.Diagnose(doc, diagnoser);
        break;

      case FileType.animation_controller:
        AnimationController.Diagnose(doc, diagnoser);
        break;

      case FileType.block:
        Block.Diagnose(doc, diagnoser);
        break;

      case FileType.entity:
        Entity.Diagnose(doc, diagnoser);
        break;

      case FileType.function:
        Mcfunction.Diagnose(doc, diagnoser);
        break;

      case FileType.item:
        Item.Diagnose(doc, diagnoser);
        break;

      case FileType.loot_table:
        LootTable.Diagnose(doc, diagnoser);
        break;

      case FileType.manifest:
        Manifest.Diagnose(doc, diagnoser);
        break;

      case FileType.script:
        Script.Diagnose(doc, diagnoser);
        break;

      case FileType.spawn_rule:
        SpawnRule.Diagnose(doc, diagnoser);
        break;

      case FileType.structure:
        Structure.Diagnose(doc, diagnoser);
        break;

      case FileType.trading:
        Trading.Diagnose(doc, diagnoser);
        break;

      default:
      case FileType.unknown:
        return false;
    }

    return true;
  }
}
