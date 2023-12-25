import { Internal, ResourcePack, BehaviorPack, DataSetConnector } from "bc-minecraft-bedrock-project";
import { Script } from "bc-minecraft-bedrock-project/lib/src/Lib/Internal/Types";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";

export function minecraft_animation_used(
  animations: Types.Definition,
  diagnoser: DiagnosticsBuilder,
  controllers: DataSetConnector<
    ResourcePack.AnimationController.AnimationController | BehaviorPack.AnimationController.AnimationController,
    ResourcePack.ResourcePack
  >,
  script?: Script
): void {
  const used: string[] = [];

  if (script) {
    Types.Conditional.forEach(script.animate, (ref, condition) => used.push(ref));
  }

  //Extract animations from controllers
  Types.Definition.forEach(animations, (ref, id) => {
    const controller = controllers.get(id);

    //If it is a controller, then add used animations
    if (controller) {
      used.push(...controller.animations.using);
    }
  });

  //
  Types.Definition.forEach(animations, (ref, id) => {
    //If the used animations does not contain the referenced animation, then its unused
    if (!used.includes(ref)) {
      diagnoser.add(
        `${ref}/${id}`,
        `Animation: ${id} is not being used, could be removed`,
        DiagnosticSeverity.info,
        `minecraft.animation.unused`
      );
    }
  });
}
