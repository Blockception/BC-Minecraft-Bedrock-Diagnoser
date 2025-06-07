import { Errors } from "../..";
import { DiagnosticsBuilder } from "../../../types";

export function behaviorpack_feature_diagnose(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const feat = diagnoser.context.getProjectData().behaviors.trading.get(id, diagnoser.project);
  if (feat === undefined) {
    Errors.missing("behaviors", "features", id, diagnoser);
    return false;
  }

  return false;
}
