import { Internal, SMap } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { diagnose_molang } from "../../Molang/diagnostics";
import { Json } from "../../Json/Json";
import { BoneAnimation } from "bc-minecraft-bedrock-project/lib/src/Lib/Internal/ResourcePack";
import { BoneUsage, checkBonesExists } from "../Model";

/**Diagnoses the given document as an animation
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Animations", diagnoser);

  const anims = Json.LoadReport<Internal.ResourcePack.Animations>(diagnoser);
  if (!Internal.ResourcePack.Animations.is(anims)) return;

  const bones: BoneUsage[] = [];

  SMap.forEach(anims.animations, (anim, anim_id) => {
    const length = anim.animation_length;

    SMap.forEach(anim.bones, (bone, bone_id) => {
      bones.push({ bone_id, parent_id: anim_id });

      if (typeof length === "number") {
        check_bone_time(`${anim_id}/${bone_id}`, bone, length, diagnoser);
      }
    });
  });

  checkBonesExists(bones, diagnoser);
}

function check_bone_time(parentid: string, bone: BoneAnimation, animation_length: number, diagnoser: DocumentDiagnosticsBuilder) {
  check_bone_property_time(parentid, bone.position, animation_length, diagnoser);
  check_bone_property_time(parentid, bone.rotation, animation_length, diagnoser);
  check_bone_property_time(parentid, bone.scale, animation_length, diagnoser);
}

type BoneProperties = BoneAnimation["position" | "rotation" | "scale"];

function check_bone_property_time(parentid: string, property: BoneProperties, animation_length: number, diagnoser: DocumentDiagnosticsBuilder) {
  if (typeof property !== "object") return;
  if (Array.isArray(property)) return;

  for (const k of Object.keys(property)) {
    //Parse as float
    try {
      const time = parseFloat(k);
      if (isNaN(time)) {
        diagnoser.add(k, `Failed to parse time value: ${k}`, DiagnosticSeverity.error, "general.float.invalid");
      } else if (time > animation_length) {
        diagnoser.add(
          `${parentid}/${k}`,
          `Time value of bone ${k} is greater than the animation length: ${animation_length}`,
          DiagnosticSeverity.error,
          "resourcepack.animation.time.exceeds"
        );
      }
    } catch (err) {
      diagnoser.add(k, `Failed to parse time value: ${k}\n${err}`, DiagnosticSeverity.error, "general.float.invalid");
    }
  }
}
