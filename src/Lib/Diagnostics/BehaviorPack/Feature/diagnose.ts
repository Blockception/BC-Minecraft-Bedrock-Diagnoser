import { check_definition_value } from "../../Definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types";

export function behaviorpack_feature_diagnose(id: string, diagnoser: DiagnosticsBuilder): boolean {

  if (!id) return false;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.feature, id, diagnoser)) return true;

  //Missing namespace?
  if (!id.includes(":")) id = "minecraft:" + id;

  //Project has
  const data = diagnoser.context.getCache();
  if (data.behaviorPacks.features.has(id)) return true;

  //Vanilla has entity
  // if (MinecraftData.BehaviorPack) return true;

  //Nothing then report error
  diagnoser.add(
    id,
    `Cannot find behaviorpack feature definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.feature.missing"
  );
  return false;
}
