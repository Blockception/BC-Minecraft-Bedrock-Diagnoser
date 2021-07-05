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
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
    //Filter doc type
    const Type = FileType.detect(doc.uri);

    switch (Type) {
      case FileType.animation:
        return Animation.Diagnose(doc, diagnoser);

      case FileType.animation_controller:
        return AnimationController.Diagnose(doc, diagnoser);

      case FileType.block:
        return Block.Diagnose(doc, diagnoser);

      case FileType.entity:
        return Entity.Diagnose(doc, diagnoser);

      case FileType.function:
        return Mcfunction.Diagnose(doc, diagnoser);

      case FileType.item:
        return Item.Diagnose(doc, diagnoser);

      case FileType.loot_table:
        return LootTable.Diagnose(doc, diagnoser);

      case FileType.manifest:
        return Manifest.Diagnose(doc, diagnoser);

      case FileType.script:
        return Script.Diagnose(doc, diagnoser);

      case FileType.spawn_rule:
        return SpawnRule.Diagnose(doc, diagnoser);

      case FileType.structure:
        return Structure.Diagnose(doc, diagnoser);

      case FileType.trading:
        return Trading.Diagnose(doc, diagnoser);

      default:
      case FileType.unknown:
        return;
    }
  }
}
