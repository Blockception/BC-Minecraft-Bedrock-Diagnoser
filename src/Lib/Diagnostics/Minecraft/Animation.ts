import { ResourcePack, BehaviorPack, DataSetConnector } from "bc-minecraft-bedrock-project";
import { Script } from "bc-minecraft-bedrock-project/lib/src/Lib/Internal/Types";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/Severity";

export interface AnimationUsage {
  animation_controllers: Types.Definition;
  animations: Types.Definition;
  script: Script;
}

export function minecraft_animation_used(
  data: AnimationUsage,
  diagnoser: DiagnosticsBuilder,
  controllers: DataSetConnector<
    ResourcePack.AnimationController.AnimationController | BehaviorPack.AnimationController.AnimationController,
    ResourcePack.ResourcePack
  >
): void {
  // Scripts, animation controller use a reference name to an animation
  const refsUsed: Record<string, boolean> = {};
  const { animation_controllers, animations, script } = data;

  // Animations field is to be used by script and animations controllers
  Types.Definition.forEach(animations, (ref, id) => {
    // Mark as unused
    refsUsed[ref] = false;

    controllers.get(id)?.animations.using.forEach((anim) => (refsUsed[anim] = true));
  });

  // Script will use animations
  Types.Conditional.forEach(script.animate, (id, condition) => (refsUsed[id] = true));

  // Animation controllers are assumed to be always active
  Types.Definition.forEach(animation_controllers, (ref, id) => {
    refsUsed[ref] = true
  
    controllers.get(id)?.animations.using.forEach((anim) => (refsUsed[anim] = true));
  });

  // Check if animations are used
  Types.Definition.forEach(animations, (ref, id) => {
    //If the used animations does not contain the referenced animation, then its unused
    if (refsUsed[ref] === true) {
      return;
    }

    diagnoser.add(
      `${ref}/${id}`,
      `Animation: ${id} is not being used, could be removed`,
      DiagnosticSeverity.info,
      `minecraft.animation.unused`
    );
  });
}
