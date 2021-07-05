import { MolangFullSet, MolangSet } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

export function Diagnose(using: MolangSet | MolangFullSet, definer: MolangSet | MolangFullSet, diagnoser: DiagnosticsBuilder) {
  if (MolangFullSet.isEither(using)) {
    const temp = MolangFullSet.upgrade(definer);

    return DiagnoseFull(using, temp, diagnoser);
  }

  return DiagnoseSet(using, definer, diagnoser);
}

export function DiagnoseSet(using: MolangSet, definer: MolangSet, diagnoser: DiagnosticsBuilder) {
  //TODO add molang diagnoser
}

export function DiagnoseFull(using: MolangFullSet, definer: MolangFullSet, diagnoser: DiagnosticsBuilder) {
  //TODO add molang diagnoser
}
