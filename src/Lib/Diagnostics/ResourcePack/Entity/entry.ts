import { Internal, ResourcePack } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder } from "../../../Types";
import { Json } from "../../Json/Json";
import { animation_controller_diagnose_implementation } from "../Animation Controllers/diagnostics";
import { animation_or_controller_diagnose_implementation } from "../anim or controller";
import { Molang } from "bc-minecraft-molang";
import { Types } from "bc-minecraft-bedrock-types";
import { diagnose_molang } from "../../Molang/diagnostics";
import { render_controller_diagnose_implementation } from "../Render Controller/diagnostics";
import { resourcepack_has_model } from "../Model/diagnose";
import { texture_files_diagnose } from "../Texture Atlas/entry";
import { resourcepack_particle_diagnose } from "../Particle/diagnose";
import { diagnose_script } from "../../Minecraft/Script";
import { diagnose_resourcepack_sounds } from "../Sounds/diagnostics";
import { resourcepack_animation_used } from "../Animation/usage";
import { AnimationUsage } from "../../Minecraft";

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
    if (temp) animation_controller_diagnose_implementation(temp, entityGathered, "Entities", diagnoser);
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

  //Get pack
  const pack = diagnoser.context.getCache().ResourcePacks.get(diagnoser.document.uri);
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
