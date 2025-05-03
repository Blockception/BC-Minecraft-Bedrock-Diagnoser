import { DocumentDiagnosticsBuilder } from "../../types";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/project/resource-pack";

import * as Animation from "./animation/entry";
import * as AnimationController from "./animation-controllers/entry";
import * as Attachable from "./attachable/entry";
import * as BlockCulling from "./block-culling/entry";
import * as BiomesClient from "./biomes-client/entry";
import * as Block from "./block/entry";
import * as Blocks from "./block/entry";
import * as Entity from "./entity/entry";
import * as Fog from "./fog/entry";
import * as Item from "./item/entry";
import * as Manifest from "./manifest/entry";
import * as Material from "./material/entry";
import * as Model from "./model/entry";
import * as MusicDefinitions from "./music-definitions/entry";
import * as Particle from "./particle/entry";
import * as RenderController from "./render-controller/entry";
import * as Sounds from "./sounds/entry";
import * as SoundsDefinitions from "./sounds-definitions/entry";
import * as Texture from "./texture/entry";
import * as TextureAtlas from "./texture-atlas/entry";
import * as Flipbook from "./texture-atlas/flipbook";

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
