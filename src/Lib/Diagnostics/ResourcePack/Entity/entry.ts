import { Internal, MolangFullSet, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from "../../Json/Json";
import { animation_controller_diagnose_implementation } from "../Animation Controllers/diagnostics";
import { animation_or_controller_diagnose_implementation } from "../anim or controller";

/**Diagnoses the given document as an RP entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //TODO add rp diagnostics
  //No behaviorpack check, entities can exist without their bp side (for servers)

  const entity = Json.LoadReport<Internal.ResourcePack.Entity>(doc, diagnoser);

  if (!Internal.ResourcePack.Entity.is(entity)) return;

  const container = entity["minecraft:client_entity"].description;
  const MolangData = MolangFullSet.harvest(container);

  //Check animations / animation controllers
  Internal.Definition.forEach(container.animations, (value, key) => animation_or_controller_diagnose_implementation(value, MolangData, diagnoser));

  //Check animation controllers
  container.animation_controllers?.forEach((controller) => animation_controller_diagnose_implementation(controller, MolangData, diagnoser));

  //TODO check Geo
  //TODO check textures
  //TODO check sounds
  //TODO check particles
}
