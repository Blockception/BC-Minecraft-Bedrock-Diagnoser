import { diagnose_molang } from "../../Molang/diagnostics";
import { DocumentDiagnosticsBuilder } from "../../../Types";
import { general_animation_controllers } from "../../Minecraft/Animation Controllers";
import { Internal } from "bc-minecraft-bedrock-project";
import { Json } from "../../Json/Json";
import { json_commandsCheck } from "../Mcfunction/commands";
import { SMap } from "bc-minecraft-bedrock-project";

/**Diagnoses the given document as an animation controller
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  const text = diagnoser.document.getText();
  diagnose_molang(text, "AnimationsControllers", diagnoser);

  const controllers = Json.LoadReport<Internal.BehaviorPack.AnimationControllers>(diagnoser);
  if (!Internal.BehaviorPack.AnimationControllers.is(controllers)) return;

  //Transition check
  general_animation_controllers(controllers, diagnoser);

  //foreach animation,
  SMap.forEach(controllers.animation_controllers, (controller, id) => {
    SMap.forEach(controller.states, (state, state_id) => {
      state.on_entry?.forEach((item) => json_commandsCheck(item, diagnoser));
      state.on_exit?.forEach((item) => json_commandsCheck(item, diagnoser));
    });
  });
}
