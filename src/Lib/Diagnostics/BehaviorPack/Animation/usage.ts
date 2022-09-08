
import { Script } from 'bc-minecraft-bedrock-project/lib/src/Lib/Internal/Types';
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../../Types";
import { minecraft_animation_used } from "../../Minecraft/Animation";

export function behaviorpack_animation_used(animations: Types.Definition | undefined, diagnoser: DiagnosticsBuilder, script?: Script): void {
  if (animations === undefined) return;

  minecraft_animation_used(animations, diagnoser, diagnoser.context.getCache().BehaviorPacks.animation_controllers, script);
}
