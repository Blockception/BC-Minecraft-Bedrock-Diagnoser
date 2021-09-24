import { Defined, DefinedUsing, MolangFullSet, MolangSet } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function diagnose_molang(using: MolangSet | MolangFullSet, definer: MolangSet | MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  if (MolangFullSet.isEither(using)) {
    const temp = MolangFullSet.upgrade(definer);

    return diagnose_molangfull(using, temp, diagnoser);
  }

  return diagnose_molangset(using, definer, diagnoser);
}

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function diagnose_molangset(using: MolangSet, definer: MolangSet, diagnoser: DiagnosticsBuilder): void {
  diagnose_using(using.variables, definer.variables, diagnoser, "variable");
}

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function diagnose_molangfull(using: MolangFullSet, definer: MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  diagnose_using(using.variables, definer.variables, diagnoser, "variable");

  diagnose_using(using.geometries, definer.geometries, diagnoser, "geometry");
  diagnose_using(using.materials, definer.materials, diagnoser, "material");
  diagnose_using(using.textures, definer.textures, diagnoser, "texture");
}

/**Diagnoses the given using set to the given defining set
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to
 * @param name The name of the data set such as `variable` or `query`*/
function diagnose_using(using: DefinedUsing<string>, definer: Defined<string>, diagnoser: DiagnosticsBuilder, name: string): void {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (var I = 0; I < checks.length; I++) {
    const check = checks[I];

    if (defined1.includes(check) || defined2.includes(check)) {
      //Valid
      continue;
    } else {
      diagnoser.Add(name === "variable" ? "scripts" : check, `Missing molang defintion: ${name}.${check}`, DiagnosticSeverity.error, `molang.${name}.missing`);
    }
  }
}
