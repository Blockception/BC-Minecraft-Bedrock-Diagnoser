import { Defined, DefinedUsing, MolangFullSet, MolangSet } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

export function Diagnose(using: MolangSet | MolangFullSet, definer: MolangSet | MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  if (MolangFullSet.isEither(using)) {
    const temp = MolangFullSet.upgrade(definer);

    return DiagnoseFull(using, temp, diagnoser);
  }

  return DiagnoseSet(using, definer, diagnoser);
}

export function DiagnoseSet(using: MolangSet, definer: MolangSet, diagnoser: DiagnosticsBuilder): void {
  DiagnoseUsing(using.variables, definer.variables, diagnoser, "variable");
}

export function DiagnoseFull(using: MolangFullSet, definer: MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  DiagnoseUsing(using.variables, definer.variables, diagnoser, "variable");

  DiagnoseUsing(using.geometries, definer.geometries, diagnoser, "geometry");
  DiagnoseUsing(using.materials, definer.materials, diagnoser, "material");
  DiagnoseUsing(using.textures, definer.textures, diagnoser, "texture");
}

/**
 *
 * @param using
 * @param definer
 * @param diagnoser
 * @param name
 */
function DiagnoseUsing(using: DefinedUsing<string>, definer: Defined<string>, diagnoser: DiagnosticsBuilder, name: string): void {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (var I = 0; I < checks.length; I++) {
    const check = checks[I];

    if (defined1.includes(check) || defined2.includes(check)) {
      //Valid
    } else {
      diagnoser.Add(check, `Missing molang defintion: ${name}.${check}`, DiagnosticSeverity.error, `molang.${name}.missing`);
    }
  }
}
