import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { check_definition_value, education_enabled } from "../../Definitions";

export function resourcepack_check_entityid(id: string, diagnoser: DiagnosticsBuilder) {
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.entity, id, diagnoser)) return;

  const data = diagnoser.context.getCache();

  //Project has entity
  if (data.hasEntity(id)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has entity
  if (MinecraftData.ResourcePack.hasEntity(id, edu)) return;

  //Nothing then report error
  diagnoser.add(id, `Cannot find entity definition: ${id}`, DiagnosticSeverity.error, "resourcepack.entity.missing");
}
