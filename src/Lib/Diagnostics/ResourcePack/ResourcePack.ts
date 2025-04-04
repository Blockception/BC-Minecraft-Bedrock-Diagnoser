import { DocumentDiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/project/resource-pack";

import * as Animation from "./Animation/entry";
import * as AnimationController from "./Animation Controllers/entry";
import * as Attachable from "./Attachable/entry";
import * as BlockCulling from "./BlockCulling/entry";
import * as BiomesClient from "./Biomes Client/entry";
import * as Block from "./Block/entry";
import * as Blocks from "./Block/entry";
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
import * as Flipbook from "./Texture Atlas/flipbook";

/** The namespace that deals with resourcepack diagnostics */
export namespace ResourcePack {
  /** Processes and diagnoses the given textdocument
   * @param doc The document to process / diagnose
   * @param diagnoser The diagnoser to report to
   * @returns `true` or `false` whenever or not it was succesfull */
  export function Process(diagnoser: DocumentDiagnosticsBuilder): boolean {
    const uri = diagnoser.document.uri;
    const type = FileType.detect(uri);

    switch (type) {
      case FileType.animation:
        Animation.Diagnose(diagnoser);
        break;

      case FileType.animation_controller:
        AnimationController.Diagnose(diagnoser);
        break;

      case FileType.attachable:
        Attachable.Diagnose(diagnoser);
        break;

      case FileType.block_culling_rules:
        BlockCulling.Diagnose(diagnoser);
        break;

      case FileType.biomes_client:
        BiomesClient.Diagnose(diagnoser);
        break;

      case FileType.block:
        if (uri.endsWith("blocks.json")) {
          Blocks.Diagnose(diagnoser);
        } else {
          Block.Diagnose(diagnoser);
        }

        break;

      case FileType.entity:
        Entity.Diagnose(diagnoser);
        break;

      case FileType.fog:
        Fog.Diagnose(diagnoser);
        break;

      case FileType.item:
        Item.Diagnose(diagnoser);
        break;

      case FileType.manifest:
        Manifest.Diagnose(diagnoser);
        break;

      case FileType.material:
        Material.Diagnose(diagnoser);
        break;

      case FileType.model:
        Model.Diagnose(diagnoser);
        break;

      case FileType.music_definitions:
        MusicDefinitions.Diagnose(diagnoser);
        break;

      case FileType.particle:
        Particle.Diagnose(diagnoser);
        break;

      case FileType.render_controller:
        RenderController.Diagnose(diagnoser);
        break;

      case FileType.sounds:
        Sounds.Diagnose(diagnoser);
        break;

      case FileType.sounds_definitions:
        SoundsDefinitions.Diagnose(diagnoser);
        break;

      case FileType.texture:
        Texture.Diagnose(diagnoser);
        break;

      case FileType.texture_flipbook_atlas:
        Flipbook.DiagnoseFlipbook(diagnoser);
        break;

      case FileType.texture_item_atlas:
      case FileType.texture_terrain_atlas:
        TextureAtlas.DiagnoseAtlas(diagnoser);
        break;

      default:
      case FileType.unknown:
        return false;
    }

    return true;
  }
}
