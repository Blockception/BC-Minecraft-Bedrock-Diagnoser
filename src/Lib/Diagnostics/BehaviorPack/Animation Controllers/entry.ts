import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { general_animation_controllers } from "../../Minecraft/Animation Controllers";
import { Json } from "../../Json/Json";
import { diagnose_molang } from '../../Molang/diagnostics';

/**Diagnoses the given document as an animation controller
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(doc.getText(), "animation_controller", diagnoser);

  const controllers = Json.LoadReport<Internal.BehaviorPack.AnimationControllers>(doc, diagnoser);

  if (!Internal.BehaviorPack.AnimationControllers.is(controllers)) return;

  //Transition check
  general_animation_controllers(controllers, diagnoser);

  //TODO add bp animation controller diagnostics
          
  
}
