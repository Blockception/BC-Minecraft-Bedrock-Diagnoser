import { Identifiable } from 'bc-minecraft-bedrock-types/lib/src/Types/Identifiable';
import { Defined, DefinedUsing, Molang, MolangData, MolangFullSet, MolangSet, Using } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../Types/DiagnosticsBuilder/Severity";

export type OwnerType = "block" | "entity" | "item" | "feature" | "particle" | "animation" | "animation_controller";


/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function diagnose_molang_implementation(using: MolangSet | MolangFullSet, definer: MolangSet | MolangFullSet, owner: OwnerType, diagnoser: DiagnosticsBuilder): void {
  //Is full set?
  if (MolangFullSet.isEither(using)) {
    //Upgrade if nesscary and check
    const temp = MolangFullSet.upgrade(definer);

    diagnose_molang_using(using.geometries, temp.geometries, diagnoser, "geometry");
    diagnose_molang_using(using.materials, temp.materials, diagnoser, "material");
    diagnose_molang_using(using.textures, temp.textures, diagnoser, "texture");
  }

  //Check variable vs variables and such
  diagnose_molang_variable_using(using.variables, definer.variables, diagnoser, owner);
  diagnose_molang_temp_using(using.temps, definer.variables, diagnoser, owner);

}

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function diagnose_molang(using: string, owner: OwnerType, diagnoser: DiagnosticsBuilder): void {
  diagnose_molang_query_using(using, diagnoser);
  diagnose_molang_math_using(using, diagnoser);
  diagnose_molang_context_using(using, diagnoser, owner);
}

/**Diagnoses the given using set to the given defining set
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to
 * @param name The name of the data set such as `variable` or `query`*/
function diagnose_molang_using(using: DefinedUsing<string>, definer: Defined<string>, diagnoser: DiagnosticsBuilder, name: string): void {
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

function GetNamespace(owner : OwnerType) {
    //Vanilla provides?
    switch (owner) {
      case "animation":
      case "animation_controller":
        break;
      
      case "block":
        return MolangData.Blocks;

      case "entity":
        return MolangData.Entities;

      case "feature":
        return MolangData.FeaturesRules;

      case "item":
        return MolangData.Items;

      case "particle":
        return MolangData.Particle;
    }

    return undefined;
}

function diagnose_molang_variable_using(using: DefinedUsing<string>, definer: Defined<string>, diagnoser: DiagnosticsBuilder, owner: OwnerType) {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (var I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Check if the variable is defined
    if (defined1.includes(check) || defined2.includes(check)) continue;

    //Vanilla provides?
    if (Identifiable.has(GetNamespace(owner)?.Variables ?? [], check)) continue;

    diagnoser.Add("scripts", `Missing molang variable defintion: ${check}`, DiagnosticSeverity.error, `molang.variable.missing`);
  }
}

function diagnose_molang_temp_using(using: DefinedUsing<string>, definer: Defined<string>, diagnoser: DiagnosticsBuilder, owner: OwnerType) {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (var I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Check if the temp is defined
    if (defined1.includes(check) || defined2.includes(check)) continue;

    //Vanilla provides?
    if (Identifiable.has(GetNamespace(owner)?.Temps ?? [], check)) continue;

    diagnoser.Add(check, `Missing molang temps defintion: ${check}`, DiagnosticSeverity.error, `molang.temp.missing`);
  }
}

function diagnose_molang_context_using(using: Using<string> | string, diagnoser: DiagnosticsBuilder, owner: OwnerType) {
  if (typeof using === "string") {
    const out = Using.create<string>();
    Molang.Context.getUsing(using, out.using);
    using = out;
  }

  const checks = using.using;

  for (var I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Vanilla provides?
    if (Identifiable.has(GetNamespace(owner)?.Contents ?? [], check)) continue;

    diagnoser.Add(check, `Missing molang context defintion: ${check}`, DiagnosticSeverity.error, `molang.context.${owner}.unknown`);
  }
}

/**
 * 
 * @param using 
 * @param diagnoser 
 * @param owner 
 */
export function diagnose_molang_query_using(using: Using<string> | string, diagnoser: DiagnosticsBuilder) {
  if (typeof using === "string") {
    const out = Using.create<string>();
    Molang.Queries.getUsing(using, out.using);
    using = out;
  }

  const checks = using.using;

  for (let I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Vanilla provides?
    if (Identifiable.has(MolangData.General.Queries, check)) continue;

    diagnoser.Add(check, `Unknown molang query function: ${check}`, DiagnosticSeverity.error, `molang.query.unknown`);
  }
}

/**
 * 
 * @param using 
 * @param diagnoser 
 * @param owner 
 */
export function diagnose_molang_math_using(using: Using<string> | string, diagnoser: DiagnosticsBuilder) {
  if (typeof using === "string") {
    const out = Using.create<string>();
    Molang.Math.getUsing(using, out.using);
    using = out;
  }

  const checks = using.using;

  for (let I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Vanilla provides?
    if (Identifiable.has(MolangData.General.Math, check)) continue;

    diagnoser.Add(check, `Unknown molang math function: ${check}`, DiagnosticSeverity.error, `molang.math.unknown`);
  }
}