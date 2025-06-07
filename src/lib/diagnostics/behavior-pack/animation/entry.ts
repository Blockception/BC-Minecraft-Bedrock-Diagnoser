import { Internal, SMap } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json/json";
import { diagnose_molang } from "../../molang/diagnostics";
import { json_commandsCheck } from "../mcfunction/commands";
import { no_other_duplicates } from "../../packs/duplicate-check";

/**Diagnoses the given document as an animation
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  const text = diagnoser.document.getText();
  diagnose_molang(text, "Animations", diagnoser);

  const anims = Json.LoadReport<Internal.BehaviorPack.Animations>(diagnoser);
  if (!Internal.BehaviorPack.Animations.is(anims)) return;

  //foreach animation,
  SMap.forEach(anims.animations, (anim, id) => {
    const length = anim.animation_length;

    // check that no other exists with this id
    no_other_duplicates("behaviorpack.animation", diagnoser.context.getProjectData().projectData.behaviorPacks.animations, id, diagnoser);

    //foreach time
    SMap.forEach(anim.timeline, (data, time) => {
      json_commandsCheck(data, diagnoser);

      if (length) {
        const temp = Number.parseFloat(time);

        if (temp > length)
          diagnoser.add(
            `${id}/timeline/${time}`,
            "Time specification is outside the animation range",
            DiagnosticSeverity.warning,
            "minecraft.animation.time.range"
          );
      }
    });
  });
}
