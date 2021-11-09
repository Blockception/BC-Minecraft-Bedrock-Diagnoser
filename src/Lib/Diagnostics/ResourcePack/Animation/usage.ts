import { Internal } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { minecraft_animation_used } from "../../Minecraft/Animation";

export function resourcepack_animation_used(animations: Types.Definition | undefined, diagnoser: DiagnosticsBuilder, script?: Internal.Script): void {
  if (animations === undefined) return;

  minecraft_animation_used(animations, diagnoser, diagnoser.context.getCache().ResourcePacks.animation_controllers, script);
}
