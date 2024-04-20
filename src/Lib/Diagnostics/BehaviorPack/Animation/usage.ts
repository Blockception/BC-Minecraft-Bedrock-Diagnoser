import { DiagnosticsBuilder } from "../../../Types";
import { AnimationUsage, minecraft_animation_used } from "../../Minecraft/Animation";

/**
 * Checks if the animations and animation controllers which are defined are used
 * @param data The dataset to check
 * @param diagnoser The diagnoser builder to receive the errors
 */
export function behaviorpack_animation_used(data: AnimationUsage, diagnoser: DiagnosticsBuilder): void {
  const controllers = diagnoser.context.getCache().BehaviorPacks.animation_controllers;

  minecraft_animation_used(data, diagnoser, controllers);
}
