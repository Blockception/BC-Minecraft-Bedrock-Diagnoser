import {
  AnimationCarrier,
  BehaviorPack,
  Internal,
  MolangCarrier,
  ResourcePack,
  SMap,
} from "bc-minecraft-bedrock-project";
import { State } from "bc-minecraft-bedrock-project/lib/src/internal/behavior-pack";
import { Types } from "bc-minecraft-bedrock-types";
import { Defined, Molang, MolangDataSetKey } from "bc-minecraft-molang";
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../types';
import { forEach } from "../../utility/using-defined";
import { diagnose_molang_implementation } from "../molang/diagnostics";

export type animation_controllers =
  | Internal.BehaviorPack.AnimationControllers
  | Internal.ResourcePack.AnimationControllers;
export type animation_controller =
  | Internal.BehaviorPack.AnimationController
  | Internal.ResourcePack.AnimationController;
export type animationsOwner = Types.Identifiable & MolangCarrier<Molang.MolangSet> & AnimationCarrier<Defined<string>>;

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
      diagnoser.add(
        `${controller_id}/initial_state/${initial_state}`,
        "Cannot find initial state, minecraft will revert to state at 0 index",
        DiagnosticSeverity.warning,
        "minecraft.animation_controller.state.missing"
      );
    }
  }

  const states = Object.keys(controller.states);
  const transitionedStates = new Set()

  //Check states
  SMap.forEach(controller.states, (state) => {
    //Check transitions
    if (state.transitions) {
      CheckTransition(controller_id, state.transitions, controller.states, diagnoser).forEach(transition => transitionedStates.add(transition))
    }
  });

  states.forEach(state => {
    if (!transitionedStates.has(state) && controller.initial_state != state) diagnoser.add(
      `${controller_id}/${state}`,
      `"${state}" state is never reached.`,
      DiagnosticSeverity.info,
      "minecraft.animation_controller.state.never_reached"
    );
  })  

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
): string[] {
  const transitionedStates: string[] = []
  //Loop over the transitions
  for (let I = 0; I < Transitions.length; I++) {
    const trans = Transitions[I];
    //Get state identification refered
    const state: string = typeof trans === "string" ? trans : Object.getOwnPropertyNames(trans)[0];

    //check is map contains any value
    if (States[state] === undefined) {
      diagnoser.add(
        controller + "/states/" + state,
        `missing state defined by transition: ${state}`,
        DiagnosticSeverity.error,
        "minecraft.animation_controller.state.missing"
      );
    } else transitionedStates.push(state)
  }
  return transitionedStates
}

export type Controller =
  | ResourcePack.AnimationController.AnimationController
  | BehaviorPack.AnimationController.AnimationController;

export function general_animation_controllers_implementation(
  controller: Controller,
  user: Types.Identifiable & AnimationCarrier<Defined<string>> & MolangCarrier<Molang.MolangSetOptional>,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
) {
  //for each animation, check if the defined animation is also used
  forEach(controller?.animations.using, (anim_id) => {
    if (user.animations.defined.includes(anim_id)) return;

    diagnoser.add(
      `${user.id}/${controller.id}`,
      `Animation controller (${controller.id}) is using animation: '${anim_id}' but ${user.id} has nothing defined that matches the given key\nMinecraft will still run but might return null errors on the animation`,
      DiagnosticSeverity.warning,
      "minecraft.animation_controller.animation.undefined"
    );
  });

  //Molang
  diagnose_molang_implementation(controller, user, ownerType, diagnoser);
}
