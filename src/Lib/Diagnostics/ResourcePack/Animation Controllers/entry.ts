import { Internal } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder} from "../../../Types";
import { general_animation_controllers } from "../../Minecraft/Animation Controllers";
import { Json } from "../../Json/Json";
import { diagnose_molang } from "../../Molang/diagnostics";

/**Diagnoses the given document as an animation controller
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "AnimationsControllers", diagnoser);

  const controllers = Json.LoadReport<Internal.ResourcePack.AnimationControllers>(diagnoser);

  if (!Internal.ResourcePack.AnimationControllers.is(controllers)) return;

  //Transition check
  general_animation_controllers(controllers, diagnoser);

  //TODO add rp animation controller diagnostics
}
