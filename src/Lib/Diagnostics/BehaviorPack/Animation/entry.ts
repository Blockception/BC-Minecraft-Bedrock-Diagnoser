import { Internal, SMap } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity } from "../../../../main";
import { DocumentDiagnosticsBuilder } from "../../../Types";
import { Json } from "../../Json/Json";
import { diagnose_molang } from "../../Molang/diagnostics";
import { json_commandsCheck } from "../Mcfunction/commands";

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

    //foreach time
    SMap.forEach(anim.timeline, (data, time) => {
      json_commandsCheck(data, diagnoser);

      if (length) {
        const temp = Number.parseFloat(time);

        if (temp > length)
          diagnoser.Add(
            `${id}/timeline/${time}`,
            "Time specification is outside the animation range",
            DiagnosticSeverity.warning,
            "minecraft.animation.time.range"
          );
      }
    });
  });
}
