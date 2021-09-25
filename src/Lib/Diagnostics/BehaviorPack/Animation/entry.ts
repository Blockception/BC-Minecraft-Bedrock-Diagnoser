import { Internal, Map, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity } from '../../../../main';
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from '../../Json/Json';
import { diagnose_molang } from '../../Molang/diagnostics';
import { json_commandscheck } from '../Mcfunction/commands';

/**Diagnoses the given document as an animation
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //Check molang
  const text = doc.getText();
  diagnose_molang(text, "animation", diagnoser);

  const anims = Json.LoadReport<Internal.BehaviorPack.Animations>(doc, diagnoser);
  if (!Internal.BehaviorPack.Animations.is(anims)) return;
  
  //foreach animation, 
  Map.forEach(anims.animations, (anim, id)=>{
    const length = anim.animation_length;

    //foreach time
    Map.forEach(anim.timeline, (data, time)=>{
      json_commandscheck(data, doc, diagnoser);

      if (length) {
        const temp = Number.parseFloat(time);

        if (temp > length) diagnoser.Add(`${id}/timeline/${time}`, "Time specification is outside the animation range", DiagnosticSeverity.warning, "animation.time.range");
      }
    });
  });
}
