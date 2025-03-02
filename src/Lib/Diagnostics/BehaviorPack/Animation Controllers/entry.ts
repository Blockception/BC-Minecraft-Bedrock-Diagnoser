import { Internal, SMap } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { Json } from "../../Json/Json";
import { general_animation_controllers } from "../../Minecraft/Animation Controllers";
import { diagnose_molang } from "../../Molang/diagnostics";
import { json_commandsCheck } from "../Mcfunction/commands";

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

    diagnoser.context.getCache().behaviorPacks.animation_controllers.forEach(animation_controller => {
    if (animation_controller.id === id && animation_controller.location.uri !== diagnoser.document.uri) diagnoser.add(
      id,
      `Duplicate identifier "${id}" found.`,
      DiagnosticSeverity.warning,
      "behaviorpack.animation_controller.duplicate_id"
      );
    })

    SMap.forEach(controller.states, (state) => {
      state.on_entry?.forEach((item) => json_commandsCheck(item, diagnoser));
      state.on_exit?.forEach((item) => json_commandsCheck(item, diagnoser));
    });
  });
}
