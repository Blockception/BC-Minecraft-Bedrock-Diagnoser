import { Internal, ResourcePack } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { Molang } from "bc-minecraft-molang";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { behaviorpack_item_diagnose } from "../../behavior-pack/item";
import { Json } from "../../json/json";
import { AnimationUsage } from "../../minecraft";
import { diagnose_script } from "../../minecraft/script";
import { diagnose_molang_syntax_current_document } from '../../molang';
import { animation_or_controller_diagnose_implementation } from "../anim-or-controller";
import { resourcepack_animation_used } from "../animation/usage";
import { model_is_defined } from "../model/diagnose";
import { particle_is_defined } from "../particle/diagnose";
import { render_controller_diagnose_implementation } from "../render-controller/diagnostics";
import { diagnose_resourcepack_sounds } from "../sounds/diagnostics";
import { texture_files_diagnose } from "../texture-atlas/entry";

/**
 * Diagnoses the given document as an attachable
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function diagnose_attachable_document(diagnoser: DocumentDiagnosticsBuilder): void {
  const attachable = Json.LoadReport<Internal.ResourcePack.Attachable>(diagnoser);
  if (!Internal.ResourcePack.Attachable.is(attachable)) return;
  diagnose_molang_syntax_current_document(diagnoser, attachable);

  const description = attachable["minecraft:attachable"].description;
  const attachableGathered = ResourcePack.Attachable.Process(diagnoser.document);

  behaviorpack_item_diagnose(description.identifier, diagnoser);

  if (!attachableGathered) return;
  if (!attachableGathered.molang)
    attachableGathered.molang = Molang.MolangSet.harvest(diagnoser.document.getText());

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
  Types.Definition.forEach(description.geometry, (ref, modelId) => model_is_defined(modelId, diagnoser));

  //check particles
  Types.Definition.forEach(description.particle_effects, (ref, part_id) =>
    particle_is_defined(part_id, diagnoser)
  );

  //Get pack
  const pack = diagnoser.context.getProjectData().projectData.resourcePacks.get(diagnoser.document.uri);
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
