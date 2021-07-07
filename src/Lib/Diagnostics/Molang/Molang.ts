import { Defined, DefinedUsing, MolangFullSet, MolangSet } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function Diagnose(using: MolangSet | MolangFullSet, definer: MolangSet | MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  if (MolangFullSet.isEither(using)) {
    const temp = MolangFullSet.upgrade(definer);

    return DiagnoseFull(using, temp, diagnoser);
  }

  return DiagnoseSet(using, definer, diagnoser);
}

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function DiagnoseSet(using: MolangSet, definer: MolangSet, diagnoser: DiagnosticsBuilder): void {
  DiagnoseUsing(using.variables, definer.variables, diagnoser, "variable");
}

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function DiagnoseFull(using: MolangFullSet, definer: MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  DiagnoseUsing(using.variables, definer.variables, diagnoser, "variable");

  DiagnoseUsing(using.geometries, definer.geometries, diagnoser, "geometry");
  DiagnoseUsing(using.materials, definer.materials, diagnoser, "material");
  DiagnoseUsing(using.textures, definer.textures, diagnoser, "texture");
}

/**Diagnoses the given using set to the given defining set
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to
 * @param name The name of the data set such as `variable` or `query`*/
function DiagnoseUsing(using: DefinedUsing<string>, definer: Defined<string>, diagnoser: DiagnosticsBuilder, name: string): void {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (var I = 0; I < checks.length; I++) {
    const check = checks[I];

    if (defined1.includes(check) || defined2.includes(check)) {
      //Valid
      continue;
    } else {
      diagnoser.Add(check, `Missing molang defintion: ${name}.${check}`, DiagnosticSeverity.error, `molang.${name}.missing`);
    }
  }
}
