import {
  BehaviorPack,
  Internal,
  SMap,
  ResourcePack,
  MolangCarrier,
  AnimationCarrier,
} from "bc-minecraft-bedrock-project";
import { Defined, Molang, MolangDataSetKey } from "bc-minecraft-molang";
import { diagnose_molang_implementation } from "../Molang/diagnostics";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";
import { State } from "bc-minecraft-bedrock-project/lib/src/Lib/Internal/BehaviorPack/AnimationController";
import { Types } from "bc-minecraft-bedrock-types";

export type animation_controllers =
  | Internal.BehaviorPack.AnimationControllers
  | Internal.ResourcePack.AnimationControllers;
export type animation_controller =
  | Internal.BehaviorPack.AnimationController
  | Internal.ResourcePack.AnimationController;
export type animationsOwner = Types.Identifiable & MolangCarrier<Molang.MolangSet> & AnimationCarrier<Defined<String>>;

/**
 *
 * @param data
 * @param diagnoser
 */
export function general_animation_controllers(data: animation_controllers, diagnoser: DiagnosticsBuilder): void {
  SMap.forEach<animation_controller>(data.animation_controllers, (controller, controller_id) => {
    general_animation_controller(controller, controller_id, diagnoser);
  });
}

/**
 *
 * @param controller
 * @param controller_id
 * @param diagnoser
 */
export function general_animation_controller(
  controller: animation_controller,
  controller_id: string,
  diagnoser: DiagnosticsBuilder
): void {
  //Check if initial_state points to existing state
  if (controller.initial_state) {
    const initial_state = controller.initial_state;

    if (controller.states[initial_state] === undefined) {
      diagnoser.Add(
        `${controller_id}/initial_state/${initial_state}`,
        "Cannot find initial state, minecraft will revert to state at 0 index",
        DiagnosticSeverity.warning,
        "minecraft.animation_controller.state.missing"
      );
    }
  }

  //Check states
  SMap.forEach(controller.states, (state, state_id) => {
    //Check transitions
    if (state.transitions) CheckTransition(controller_id, state.transitions, controller.states, diagnoser);
  });
}

/**
 *
 * @param controller
 * @param Transitions
 * @param States
 * @param Builder
 */
function CheckTransition(
  controller: string,
  Transitions: Types.Conditional[],
  States: SMap<State>,
  diagnoser: DiagnosticsBuilder
): void {
  //Loop over the transitions
  for (var I = 0; I < Transitions.length; I++) {
    const trans = Transitions[I];
    //Get state identification refered
    const state: string = typeof trans === "string" ? trans : Object.getOwnPropertyNames(trans)[0];

    //check is map contains any value
    if (States[state] === undefined) {
      diagnoser.Add(
        controller + "/states/" + state,
        `missing state defined by transition: ${state}`,
        DiagnosticSeverity.error,
        "minecraft.animation_controller.state.missing"
      );
    }
  }
}

export function general_animation_controllers_implementation(
  controller:
    | ResourcePack.AnimationController.AnimationController
    | BehaviorPack.AnimationController.AnimationController,
  user: Types.Identifiable & AnimationCarrier<Defined<string>> & MolangCarrier<Molang.MolangSetOptional>,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
) {
  //for each animation
  controller.animations.using.forEach((anim_id) => {
    if (user.animations.defined.includes(anim_id)) return;

    diagnoser.Add(
      `${user.id}/${controller.id}`,
      `Animation controller (${controller.id}) is using animation: '${anim_id}' but ${user.id} has nothing defined that matches the given key\nMinecraft will still run but might return null errors on the animation`,
      DiagnosticSeverity.warning,
      "minecraft.animation_controller.animation.undefined"
    );
  });

  //Molang
  diagnose_molang_implementation(controller, user, ownerType, diagnoser);
}
