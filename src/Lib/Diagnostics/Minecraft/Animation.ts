import { Internal, ResourcePack, BehaviorPack } from "bc-minecraft-bedrock-project";
import { DataSetConnector } from "bc-minecraft-bedrock-project/lib/src/Lib/Types/DataSet/DataSetConnector";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

export function minecraft_animation_used(
  animations: Types.Definition,
  diagnoser: DiagnosticsBuilder,
  controllers: DataSetConnector<
    ResourcePack.AnimationController.AnimationController | BehaviorPack.AnimationController.AnimationController,
    ResourcePack.ResourcePack
  >,
  script?: Internal.Script
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
      diagnoser.Add(`${ref}/${id}`, `Animation: ${id} is not being used, could be removed`, DiagnosticSeverity.info, `minecraft.animation.unused`);
    }
  });
}
