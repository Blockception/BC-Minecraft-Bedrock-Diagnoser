import { Internal, MolangFullSet, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from "../../Json/Json";
import { behaviorpack_entity_components_dependencies } from "./components";
import { animation_or_controller_diagnose_implementation } from "../anim or controller";

/**Diagnoses the given document as an bp entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const entity = Json.LoadReport<Internal.BehaviorPack.Entity>(doc, diagnoser);

  if (!Internal.BehaviorPack.Entity.is(entity)) return;

  //No resourcepack check, entities can exist without their rp side

  //check components
  behaviorpack_entity_components_dependencies(entity, diagnoser);

  const container = entity["minecraft:entity"];
  const MolangData = MolangFullSet.harvest(container);

  //Check animations / animation controllers
  Internal.Definition.forEach(container.description.animations, (value, key) => animation_or_controller_diagnose_implementation(value, MolangData, diagnoser));
}
