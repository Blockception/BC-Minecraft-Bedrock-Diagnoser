import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { ResourcePack as RP } from "bc-minecraft-bedrock-project";

import * as Animation from "./Animation/entry";
import * as AnimationController from "./Animation Controllers/entry";
import * as Attachable from "./Attachable/entry";
import * as BiomesClient from "./Biomes Client/entry";
import * as Block from "./Block/entry";
import * as Blocks from "./Block/block";
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
import * as Flipbook from "./Texture Atlas/Flipbook";
import { TextDocument } from "bc-minecraft-bedrock-project";

/** The namespace that deals with resourcepack diagnostics */
export namespace ResourcePack {
  /** Processes and diagnoses the given textdocument
   * @param doc The document to process / diagnose
   * @param diagnoser The diagnoser to report to
   * @returns `true` or `false` whenever or not it was succesfull */
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): boolean {
    const Type = RP.FileType.detect(doc.uri);

    switch (Type) {
      case RP.FileType.animation:
        Animation.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.animation_controller:
        AnimationController.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.attachable:
        Attachable.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.biomes_client:
        BiomesClient.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.block:
        if (doc.uri.endsWith("blocks.json")) {
          Blocks.Diagnose(doc, diagnoser);
        } else {
          Block.Diagnose(doc, diagnoser);
        }

        break;

      case RP.FileType.entity:
        Entity.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.fog:
        Fog.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.item:
        Item.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.manifest:
        Manifest.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.material:
        Material.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.model:
        Model.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.music_definitions:
        MusicDefinitions.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.particle:
        Particle.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.render_controller:
        RenderController.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.sounds:
        Sounds.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.sounds_definitions:
        SoundsDefinitions.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.texture:
        Texture.Diagnose(doc, diagnoser);
        break;

      case RP.FileType.texture_flipbook_atlas:
        Flipbook.DiagnoseFlipbook(doc, diagnoser);
        break;

      case RP.FileType.texture_item_atlas:
      case RP.FileType.texture_terrain_atlas:
        TextureAtlas.DiagnoseAtlas(doc, diagnoser);
        break;

      default:
      case RP.FileType.unknown:
        return false;
    }

    return true;
  }
}
