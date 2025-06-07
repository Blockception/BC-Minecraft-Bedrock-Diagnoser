import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../types';
import { education_enabled } from "../../definitions";

export function resourcepack_has_model(modelId: string, diagnoser: DiagnosticsBuilder): boolean {
  const data = diagnoser.context.getProjectData().projectData;

  //Has project data
  if (data.resourcePacks.models.has(modelId)) return true;

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
