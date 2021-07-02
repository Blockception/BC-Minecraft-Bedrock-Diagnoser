import { TextDocument } from "bc-minecraft-bedrock-project";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/BehaviorPack/include";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

export namespace BehaviorPack {
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
    const Type = FileType.detect(doc.uri);

    switch (Type) {
      case FileType.animation:
        break;
      case FileType.animation_controller:
        break;
      case FileType.block:
        break;
      case FileType.entity:
        break;
      case FileType.function:
        break;
      case FileType.item:
        break;
      case FileType.loot_table:
        break;
      case FileType.manifest:
        break;
      case FileType.script:
        break;
      case FileType.spawn_rule:
        break;
      case FileType.structure:
        break;
      case FileType.trading:
        break;
      default:
      case FileType.unknown:
        break;
    }
  }
}
