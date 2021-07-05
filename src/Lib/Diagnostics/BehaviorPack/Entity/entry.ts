import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from "../../Json/Json";
import { entity_resourcepack_check } from "../../ResourcePack/Entity/Resourcepack Check";

export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const entity = Json.LoadReport<Internal.BehaviorPack.Entity>(doc, diagnoser);

  if (!Internal.BehaviorPack.Entity.is(entity)) return;

  const identifier = entity["minecraf:entity"].description.identifier;

  //Check if the resourcepack has the same entity
  entity_resourcepack_check(identifier, diagnoser);
}
