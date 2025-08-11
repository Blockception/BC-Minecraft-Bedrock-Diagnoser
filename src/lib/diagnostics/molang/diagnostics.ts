import { MolangCarrier, References } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { Defined, DefinedUsing, Molang, MolangData, MolangDataSetKey } from "bc-minecraft-molang";
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../types';

type MCarrier = Types.Identifiable & MolangCarrier<Molang.MolangSet>;

/**Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to*/
export function diagnose_molang_implementation(
  user: MCarrier,
  owner: MCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  const userId = user.id;
  const using = user.molang;
  const definer = owner.molang;
  const definerId = owner.id;

  //Is full set?
  diagnose_molang_using(userId, using, definerId, temp.geometries, diagnoser, "geometry");
  diagnose_molang_using(userId, using, definerId, temp.materials, diagnoser, "material");
  diagnose_molang_using(userId, using, definerId, temp.textures, diagnoser, "texture");

  //Check variable vs variables and such
  diagnose_molang_variable_using(userId, using.variables, definerId, definer.variables, diagnoser, ownerType);
  diagnose_molang_temp_using(using.temps, definer.temps, diagnoser, ownerType);
}

/**Diagnoses the given using set to the given defining set
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to
 * @param name The name of the data set such as `variable` or `query`*/
function diagnose_molang_using(
  userId: string,
  using: References,
  definerId: string,
  definer: Pick<References, "defined">,
  diagnoser: DiagnosticsBuilder,
  name: string
): void {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (let I = 0; I < checks.length; I++) {
    const check = checks[I];

    if (defined1.includes(check) || defined2.includes(check)) {
      //Valid
      continue;
    } else {
      diagnoser.add(
        userId,
        `The following molang is not defined: '${name}.${check}' by '${definerId}'\n\tThe definition is used by: '${userId}'`,
        DiagnosticSeverity.error,
        `molang.${name}.missing`
      );
    }
  }
}


function diagnose_molang_variable_using(
  userId: string,
  using: DefinedUsing<string>,
  definerId: string,
  definer: Defined<string>,
  diagnoser: DiagnosticsBuilder,
  owner: MolangDataSetKey
) {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (let I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Check if the variable is defined
    if (defined1.includes(check) || defined2.includes(check)) continue;

    //Vanilla provides?
    if (InternalIdentifiable.has(MolangData.get(owner)?.Variables ?? [], check)) continue;

    diagnoser.add(
      userId,
      `The molang variable 'variable.${check}' is not defined, which should be defined in this '${definerId}'\n\tThe variable is used through: '${userId}'`,
      DiagnosticSeverity.error,
      `molang.variable.missing`
    );
  }
}

function diagnose_molang_temp_using(
  using: DefinedUsing<string>,
  definer: Defined<string>,
  diagnoser: DiagnosticsBuilder,
  owner: MolangDataSetKey
) {
  const checks = using.using;
  const defined1 = definer.defined;
  const defined2 = using.defined;

  for (let I = 0; I < checks.length; I++) {
    const check = checks[I];

    //Check if the temp is defined
    if (defined1.includes(check) || defined2.includes(check)) continue;

    //Vanilla provides?
    if (InternalIdentifiable.has(MolangData.get(owner)?.Temps ?? [], check)) continue;

    diagnoser.add(
      "temp." + check,
      `The following molang temp definition is not defined: 'temp.${check}'`,
      DiagnosticSeverity.error,
      `molang.temp.missing`
    );
  }
}

namespace InternalIdentifiable {
  export function has(data: Types.Identifiable[], id: string): boolean {
    for (let I = 0; I < data.length; I++) {
      if (data[I].id.startsWith(id)) return true;
    }

    return false;
  }
}
