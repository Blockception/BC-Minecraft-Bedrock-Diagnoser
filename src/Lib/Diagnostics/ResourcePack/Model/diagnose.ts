import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { education_enabled } from "../../Definitions";

export function resourcepack_has_model(modelId: string, diagnoser: DiagnosticsBuilder): boolean {
  const data = diagnoser.context.getCache();

  //Has project data
  if (data.ResourcePacks.models.has(modelId)) return true;

  const edu = education_enabled(diagnoser);

  //Check vanilla data
  if (MinecraftData.ResourcePack.hasModel(modelId, edu)) return true;

  diagnoser.add(
    modelId,
    `Cannot find model definition: ${modelId}`,
    DiagnosticSeverity.error,
    "resourcepack.model.missing"
  );

  return false;
}
