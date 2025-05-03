import { Internal, SMap } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json/Json";
import { general_animation_controllers } from "../../minecraft/Animation Controllers";
import { diagnose_molang } from "../../molang/diagnostics";
import { no_other_duplicates } from "../../packs/duplicate-check";
import { json_commandsCheck } from "../mcfunction/commands";

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
    // check that no other exists with this id
    no_other_duplicates(
      "behaviorpack.animation_controllers",
      diagnoser.context.getCache().behaviorPacks.animation_controllers,
      id,
      diagnoser
    );

    SMap.forEach(controller.states, (state) => {
      state.on_entry?.forEach((item) => json_commandsCheck(item, diagnoser));
      state.on_exit?.forEach((item) => json_commandsCheck(item, diagnoser));
    });
  });
}
