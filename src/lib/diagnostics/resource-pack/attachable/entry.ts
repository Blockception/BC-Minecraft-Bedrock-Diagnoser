import { Internal, ResourcePack } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { Molang } from "bc-minecraft-molang";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json/Json";
import { AnimationUsage } from "../../minecraft";
import { diagnose_script } from "../../minecraft/Script";
import { diagnose_molang } from "../../molang/diagnostics";
import { animation_or_controller_diagnose_implementation } from "../anim-or-controller";
import { resourcepack_animation_used } from "../animation/usage";
import { resourcepack_has_model } from "../model/diagnose";
import { resourcepack_particle_diagnose } from "../particle/diagnose";
import { render_controller_diagnose_implementation } from "../render-controller/diagnostics";
import { diagnose_resourcepack_sounds } from "../sounds/diagnostics";
import { texture_files_diagnose } from "../texture-atlas/entry";

/**Diagnoses the given document as an attachable
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Items", diagnoser);

  //Load attacble
  const attacble = Json.LoadReport<Internal.ResourcePack.Attachable>(diagnoser);
  if (!Internal.ResourcePack.Attachable.is(attacble)) return;

  const description = attacble["minecraft:attachable"].description;
  const attachableGathered = ResourcePack.Attachable.Process(diagnoser.document);

  if (!attachableGathered) return;
  if (!attachableGathered.molang)
    attachableGathered.molang = Molang.MolangFullSet.harvest(diagnoser.document.getText());

  //#region animations
  //Check animations / animation controllers
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

    Types.Definition.forEach(controller, (ref, anim_id) => (anim_data.animation_controllers[ref] = anim_id));
  });

  Types.Definition.forEach(anim_data.animations, (reference, anim_id) =>
    animation_or_controller_diagnose_implementation(
      anim_id,
      attachableGathered,
      "Attachables",
      diagnoser,
      description.particle_effects,
      description.sound_effects
    )
  );
  Types.Definition.forEach(anim_data.animation_controllers, (ref, anim_id) =>
    animation_or_controller_diagnose_implementation(
      anim_id,
      attachableGathered,
      "Attachables",
      diagnoser,
      description.particle_effects,
      description.sound_effects
    )
  );
  //Check used animations
  resourcepack_animation_used(anim_data, diagnoser);
  //#endregion

  //Check render controllers
  description.render_controllers?.forEach((controller) => {
    const temp = getKey(controller);
    if (temp) render_controller_diagnose_implementation(temp, attachableGathered, "Attachables", diagnoser);
  });

  //Check models
  Types.Definition.forEach(description.geometry, (ref, modelId) => resourcepack_has_model(modelId, diagnoser));

  //check particles
  Types.Definition.forEach(description.particle_effects, (ref, part_id) =>
    resourcepack_particle_diagnose(part_id, diagnoser)
  );

  //Get pack
  const pack = diagnoser.context.getCache().resourcePacks.get(diagnoser.document.uri);
  if (pack === undefined) return;

  const rp_files = diagnoser.context
    .getFiles(pack.folder, ["**/textures/**/*.{tga,png,jpg,jpeg}"], pack.context.ignores)
    .map((item) => item.replace(/\\/gi, "/"));

  //Check if attachable has textures defined
  Types.Definition.forEach(description.textures, (ref, id) => {
    texture_files_diagnose(description.identifier, id, rp_files, diagnoser);
  });

  //Check if attachable has sounds defined
  diagnose_resourcepack_sounds(description.sound_effects, diagnoser);

  //Script check
  if (description.scripts) diagnose_script(diagnoser, description.scripts, description.animations);
}

function getKey(data: string | Types.Definition): string | undefined {
  if (typeof data === "string") return data;

  return Object.getOwnPropertyNames(data)[0];
}
