import { check_definition_value } from "../../definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";

export function behaviorpack_featurerule_diagnose(id: string, diagnoser: DiagnosticsBuilder): boolean {

  if (!id) return false;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.feature_rule, id, diagnoser)) return true;

  //Missing namespace?
  if (!id.includes(":")) id = "minecraft:" + id;

  //Project has
  const data = diagnoser.context.getCache();
  if (data.behaviorPacks.features_rules.has(id)) return true;

  //Vanilla has entity
  // if (MinecraftData.BehaviorPack) return true;

  //Nothing then report error
  diagnoser.add(
    id,
    `Cannot find behaviorpack feature rule definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.feature_rule.missing"
  );
  return false;
}