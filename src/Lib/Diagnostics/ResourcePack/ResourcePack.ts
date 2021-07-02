import { TextDocument } from "bc-minecraft-bedrock-project";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/ResourcePack/include";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

export namespace ResourcePack {
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
    const Type = FileType.detect(doc.uri);

    switch (Type) {
      case FileType.animation:
        break;
      case FileType.animation_controller:
        break;
      case FileType.attachable:
        break;
      case FileType.biomes_client:
        break;
      case FileType.block:
        break;
      case FileType.entity:
        break;
      case FileType.fog:
        break;
      case FileType.item:
        break;
      case FileType.manifest:
        break;
      case FileType.material:
        break;
      case FileType.model:
        break;
      case FileType.music_definitions:
        break;
      case FileType.particle:
        break;
      case FileType.render_controller:
        break;
      case FileType.sounds:
        break;
      case FileType.sounds_definitions:
        break;
      case FileType.spawn_rule:
        break;
      case FileType.texture:
        break;
      case FileType.texture_flipbook_atlas:
        break;
      case FileType.texture_item_atlas:
        break;
      case FileType.texture_terrain_atlas:
        break;
      default:
      case FileType.unknown:
        break;
    }
  }
}
