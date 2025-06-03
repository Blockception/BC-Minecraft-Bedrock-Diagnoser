import { Internal, ResourcePack } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { Molang } from "bc-minecraft-molang";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json/json";
import { AnimationUsage } from "../../minecraft";
import { diagnose_script } from "../../minecraft/script";
import { diagnose_molang } from "../../molang/diagnostics";
import { animation_or_controller_diagnose_implementation } from "../anim-or-controller";
import { animation_controller_diagnose_implementation } from "../animation-controllers/diagnostics";
import { resourcepack_animation_used } from "../animation/usage";
import { resourcepack_has_model } from "../model/diagnose";
import { resourcepack_particle_diagnose } from "../particle/diagnose";
import { render_controller_diagnose_implementation } from "../render-controller/diagnostics";
import { diagnose_resourcepack_sounds } from "../sounds/diagnostics";
import { texture_files_diagnose } from "../texture-atlas/entry";
import { behaviorpack_entityid_diagnose } from '../../behavior-pack/entity';

/**Diagnoses the given document as an RP entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //No behaviorpack check, entities can exist without their bp side (for servers)

  //Check molang math functions
  diagnose_molang(diagnoser.document.getText(), "Entities", diagnoser);

  //Load entity
  const entity = Json.LoadReport<Internal.ResourcePack.Entity>(diagnoser);
  if (!Internal.ResourcePack.Entity.is(entity)) return;

  const description = entity["minecraft:client_entity"].description;
  const entityGathered = ResourcePack.Entity.Process(diagnoser.document);

  behaviorpack_entityid_diagnose(description.identifier, diagnoser); 

  if (!entityGathered) return;
  if (!entityGathered.molang) entityGathered.molang = Molang.MolangFullSet.harvest(diagnoser.document.getText());

  // Collect all animations and animation controllers
  const anim_data: AnimationUsage = {
    animation_controllers: {},
    animations: description.animations ?? {},
    script: description.scripts ?? {},
  };
  description.animation_controllers?.forEach((controller) => {
    if (typeof controller === "string") {
      anim_data.animation_controllers[controller] = controller;
      return;
    }

    Types.Definition.forEach(controller, (ref, anim_id) => anim_data.animation_controllers[ref] = anim_id);
  });

  //#region animations
  //Check animations / animation controllers
  Types.Definition.forEach(anim_data.animations, (ref, anim_id) =>
    animation_or_controller_diagnose_implementation(
      anim_id,
      entityGathered,
      "Entities",
      diagnoser,
      description.particle_effects,
      description.sound_effects
    )
  );
  Types.Definition.forEach(anim_data.animation_controllers, (ref, anim_id) =>
    animation_or_controller_diagnose_implementation(
      anim_id,
      entityGathered,
      "Entities",
      diagnoser,
      description.particle_effects,
      description.sound_effects
    )
  );

  //Check used animations
  resourcepack_animation_used(anim_data, diagnoser);
  //#endregion

  //Check animation controllers
  description.animation_controllers?.forEach((controller) => {
    const temp = flatten(controller);
    if (temp) animation_controller_diagnose_implementation(temp, entityGathered, "Entities", diagnoser, {});
  });

  //Check render controllers
  description.render_controllers?.forEach((controller) => {
    const temp = getKey(controller);
    if (temp) render_controller_diagnose_implementation(temp, entityGathered, "Entities", diagnoser);
  });

  //Check models
  Types.Definition.forEach(description.geometry, (ref, modelId) => resourcepack_has_model(modelId, diagnoser));

  //check particles
  Types.Definition.forEach(description.particle_effects, (ref, part_id) =>
    resourcepack_particle_diagnose(part_id, diagnoser)
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const textureId = description['spawn_egg']?.['texture']

  if (typeof textureId == 'string' && !diagnoser.context.getCache().resourcePacks.itemTextures.find(val => val.id == textureId))
    diagnoser.add(`description/spawn_egg/${textureId}`,
      `Texture reference "${textureId}" was not defined in item_texture.json`,
      DiagnosticSeverity.error,
      'behaviorpack.item.components.texture_not_found')

  //Get pack
  const pack = diagnoser.context.getCache().resourcePacks.get(diagnoser.document.uri);
  if (pack === undefined) return;

  const rp_files = diagnoser.context
    .getFiles(pack.folder, ["**/textures/**/*.{tga,png,jpg,jpeg}"], pack.context.ignores)
    .map((item) => item.replace(/\\/gi, "/"));

  //Check if entity has textures defined
  Types.Definition.forEach(description.textures, (ref, id) => {
    texture_files_diagnose(description.identifier, id, rp_files, diagnoser);
  });

  //Check if entity has sounds defined
  diagnose_resourcepack_sounds(description.sound_effects, diagnoser);

  //Script check
  if (description.scripts) diagnose_script(diagnoser, description.scripts, description.animations);
}

function flatten(data: string | Types.Definition): string | undefined {
  if (typeof data === "string") return data;

  const key = Object.getOwnPropertyNames(data)[0];

  if (key) return data[key];

  return undefined;
}

function getKey(data: string | Types.Definition): string | undefined {
  if (typeof data === "string") return data;

  return Object.getOwnPropertyNames(data)[0];
}
