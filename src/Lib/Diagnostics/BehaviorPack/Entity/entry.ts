import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from "../../Json/Json";
import { entity_resourcepack_check } from "../../ResourcePack/Entity/check";
import { behaviorpack_entity_components_dependencies } from "./components";

/**Diagnoses the given document as an bp entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const entity = Json.LoadReport<Internal.BehaviorPack.Entity>(doc, diagnoser);

  if (!Internal.BehaviorPack.Entity.is(entity)) return;

  //No resourcepack check, entities can exist without their rp side

  behaviorpack_entity_components_dependencies(entity, diagnoser);
}
