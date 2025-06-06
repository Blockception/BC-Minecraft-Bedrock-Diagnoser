import { SMap } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder} from "../../../types";
import { diagnose_molang } from '../../molang/diagnostics';
import { Internal } from "bc-minecraft-bedrock-project";
import { Json } from '../../json';
import { BoneUsage, model_bones_must_exist } from '../model';

/**Diagnoses the given document as a render controller
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "RenderControllers", diagnoser);

  //Load model
  const model = Json.LoadReport<Internal.ResourcePack.RenderController>(diagnoser);
  if (!Internal.ResourcePack.RenderControllers.is(model)) return;

  const bones: BoneUsage[] = [];

  SMap.forEach(model.render_controllers, (controller, id) => {
    controller.part_visibility?.forEach((v) => {
      const key = Object.keys(v)[0];
      if (key) return;

      bones.push({ bone_id: key, parent_id: id });
    })
  })

  model_bones_must_exist(bones, diagnoser);
}
