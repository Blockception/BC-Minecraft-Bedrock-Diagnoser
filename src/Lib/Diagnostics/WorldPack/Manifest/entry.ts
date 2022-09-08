import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder";
import { Json } from "../../Json/Json";
import { minecraft_manifest_diagnose, minecraft_manifest_required_module } from "../../Minecraft/Manifest";

/**Diagnoses the given document as an bp manifest
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const manifest = Json.LoadReport<Internal.Manifest>(doc, diagnoser);

  if (!Json.TypeCheck(manifest, diagnoser, "manifest", "minecraft.manifest.invalid", Internal.Manifest.is)) return;

  minecraft_manifest_diagnose(manifest, diagnoser);
  minecraft_manifest_required_module(manifest, diagnoser, "world_template");
}
