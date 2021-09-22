import { TextDocument } from "bc-minecraft-bedrock-project";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/ResourcePack/include";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

import * as Animation from "./Animation/entry";
import * as AnimationController from "./Animation Controllers/entry";
import * as Attachable from "./Attachable/entry";
import * as BiomesClient from "./Biomes Client/entry";
import * as Block from "./Block/entry";
import * as Entity from "./Entity/entry";
import * as Fog from "./Fog/entry";
import * as Item from "./Item/entry";
import * as Manifest from "./Manifest/entry";
import * as Material from "./Material/entry";
import * as Model from "./Model/entry";
import * as MusicDefinitions from "./Music Definitions/entry";
import * as Particle from "./Particle/entry";
import * as RenderController from "./Render Controller/entry";
import * as Sounds from "./Sounds/entry";
import * as SoundsDefinitions from "./Sounds Definitions/entry";
import * as Texture from "./Texture/entry";
import * as TextureAtlas from "./Texture Atlas/entry";

export namespace ResourcePack {
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): boolean {
    const Type = FileType.detect(doc.uri);

    switch (Type) {
      case FileType.animation:
        Animation.Diagnose(doc, diagnoser);
        break;

      case FileType.animation_controller:
        AnimationController.Diagnose(doc, diagnoser);
        break;

      case FileType.attachable:
        Attachable.Diagnose(doc, diagnoser);
        break;

      case FileType.biomes_client:
        BiomesClient.Diagnose(doc, diagnoser);
        break;

      case FileType.block:
        Block.Diagnose(doc, diagnoser);
        break;

      case FileType.entity:
        Entity.Diagnose(doc, diagnoser);
        break;

      case FileType.fog:
        Fog.Diagnose(doc, diagnoser);
        break;

      case FileType.item:
        Item.Diagnose(doc, diagnoser);
        break;

      case FileType.manifest:
        Manifest.Diagnose(doc, diagnoser);
        break;

      case FileType.material:
        Material.Diagnose(doc, diagnoser);
        break;

      case FileType.model:
        Model.Diagnose(doc, diagnoser);
        break;

      case FileType.music_definitions:
        MusicDefinitions.Diagnose(doc, diagnoser);
        break;

      case FileType.particle:
        Particle.Diagnose(doc, diagnoser);
        break;

      case FileType.render_controller:
        RenderController.Diagnose(doc, diagnoser);
        break;

      case FileType.sounds:
        Sounds.Diagnose(doc, diagnoser);
        break;

      case FileType.sounds_definitions:
        SoundsDefinitions.Diagnose(doc, diagnoser);
        break;

      case FileType.texture:
        Texture.Diagnose(doc, diagnoser);
        break;

      case FileType.texture_flipbook_atlas:
        TextureAtlas.DiagnoseFlipbook(doc, diagnoser);
        break;

      case FileType.texture_item_atlas:
      case FileType.texture_terrain_atlas:
        TextureAtlas.DiagnoseAtlas(doc, diagnoser);
        break;

      default:
      case FileType.unknown:
        return false;
    }

    return true;
  }
}
