import { TextDocument } from "bc-minecraft-bedrock-project";
import { FileType } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/ResourcePack/include";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

import * as Animation from "./Animation/entry";
import * as AnimationController from "./Animation Controller/entry";
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
import * as SpawnRule from "./Spawn Rule/entry";
import * as Texture from "./Texture/entry";
import * as TextureAtlas from "./Texture Atlas/entry";

export namespace ResourcePack {
  export function Process(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
    const Type = FileType.detect(doc.uri);

    switch (Type) {
      case FileType.animation:
        return Animation.Diagnose(doc, diagnoser);

      case FileType.animation_controller:
        return AnimationController.Diagnose(doc, diagnoser);

      case FileType.attachable:
        return Attachable.Diagnose(doc, diagnoser);

      case FileType.biomes_client:
        return BiomesClient.Diagnose(doc, diagnoser);

      case FileType.block:
        return Block.Diagnose(doc, diagnoser);

      case FileType.entity:
        return Entity.Diagnose(doc, diagnoser);

      case FileType.fog:
        return Fog.Diagnose(doc, diagnoser);

      case FileType.item:
        return Item.Diagnose(doc, diagnoser);

      case FileType.manifest:
        return Manifest.Diagnose(doc, diagnoser);

      case FileType.material:
        return Material.Diagnose(doc, diagnoser);

      case FileType.model:
        return Model.Diagnose(doc, diagnoser);

      case FileType.music_definitions:
        return MusicDefinitions.Diagnose(doc, diagnoser);

      case FileType.particle:
        return Particle.Diagnose(doc, diagnoser);

      case FileType.render_controller:
        return RenderController.Diagnose(doc, diagnoser);

      case FileType.sounds:
        return Sounds.Diagnose(doc, diagnoser);

      case FileType.sounds_definitions:
        return SoundsDefinitions.Diagnose(doc, diagnoser);

      case FileType.spawn_rule:
        return SpawnRule.Diagnose(doc, diagnoser);

      case FileType.texture:
        return Texture.Diagnose(doc, diagnoser);

      case FileType.texture_flipbook_atlas:
        return TextureAtlas.DiagnoseFlipbook(doc, diagnoser);

      case FileType.texture_item_atlas:
      case FileType.texture_terrain_atlas:
        return TextureAtlas.DiagnoseAtlas(doc, diagnoser);

      default:
      case FileType.unknown:
        return;
    }
  }
}
