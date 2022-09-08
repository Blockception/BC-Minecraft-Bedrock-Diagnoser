import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from '../../../Types/Severity';
import { education_enabled } from "../../Definitions";

export function resourcepack_has_model(modelid: string, owner: string, diagnoser: DiagnosticsBuilder): boolean {
  const data = diagnoser.context.getCache();

  //Has project data
  if (data.ResourcePacks.models.has(modelid)) return true;

  const edu = education_enabled(diagnoser);

  //Check vanilla data
  if (MinecraftData.ResourcePack.hasModel(modelid, edu)) return true;

	diagnoser.Add(modelid, `Cannot find model definition: ${modelid}`, DiagnosticSeverity.error, "resourcepack.model.missing")

  return false;
}
