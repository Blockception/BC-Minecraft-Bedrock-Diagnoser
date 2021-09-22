import { Internal } from "bc-minecraft-bedrock-project";
import { Conditional } from "bc-minecraft-bedrock-project/lib/src/Lib/Internal/include";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

type animation_controller = Internal.BehaviorPack.AnimationControllers | Internal.ResourcePack.AnimationControllers;

export function general_animation_controller(Data: animation_controller, diagnoser: DiagnosticsBuilder): void {
  general_animation_controller_transition_check(Data, diagnoser);
}

/**
 *
 * @param Data
 * @param Builder
 */
export function general_animation_controller_transition_check(Data: animation_controller, diagnoser: DiagnosticsBuilder): void {
  const controllers = Data.animation_controllers;

  for (const contKey in controllers) {
    const controller = controllers[contKey];

    if (controller.states) {
      const States = Object.getOwnPropertyNames(controller.states);

      for (var I = 0; I < States.length; I++) {
        const State = controller.states[States[I]];

        if (State.transitions) CheckTransition(contKey, State.transitions, States, diagnoser);
      }
    }
  }
}

/**
 *
 * @param controller
 * @param Transitions
 * @param States
 * @param Builder
 */
function CheckTransition(controller: string, Transitions: Conditional[], States: string[], diagnoser: DiagnosticsBuilder): void {
  for (var I = 0; I < Transitions.length; I++) {
    const trans = Transitions[I];
    const State: string = typeof trans === "string" ? trans : Object.getOwnPropertyNames(trans)[0];

    if (!States.includes(State)) {
      diagnoser.Add(controller + "/states/" + State, `missing state defined by transition: ${State}`, DiagnosticSeverity.error, "animation_controller.state.missin");
    }
  }
}
