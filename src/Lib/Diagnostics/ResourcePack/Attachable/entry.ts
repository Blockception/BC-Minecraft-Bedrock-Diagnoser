import { Internal, ResourcePack } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder} from "../../../Types";
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
  if (!attachableGathered.molang) attachableGathered.molang = Molang.MolangFullSet.harvest(diagnoser.document.getText());

  //#region animations
  //Check animations / animation controllers
  Types.Definition.forEach(description.animations, (reference, anim_id) =>
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
  resourcepack_animation_used(description.animations, diagnoser, description.scripts);
  //#endregion

  //Check animation controllers
  description.animation_controllers?.forEach((controller) => {
    const temp = flatten(controller);
    if (temp) animation_controller_diagnose_implementation(temp, attachableGathered, "Attachables", diagnoser);
  });

  //Check render controllers
  description.render_controllers?.forEach((controller) => {
    const temp = getKey(controller);
    if (temp) render_controller_diagnose_implementation(temp, attachableGathered, "Attachables", diagnoser);
  });

  //Check models
  Types.Definition.forEach(description.geometry, (ref, modelId) =>
    resourcepack_has_model(modelId, diagnoser)
  );

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

  //Check if attachable has textures defined
  Types.Definition.forEach(description.textures, (ref, id) => {
    texture_files_diagnose(description.identifier, id, rp_files, diagnoser);
  });

  //Check if attachable has sounds defined
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
