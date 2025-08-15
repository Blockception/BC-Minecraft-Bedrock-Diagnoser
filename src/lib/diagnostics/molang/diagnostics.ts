import { Identifiable } from 'bc-minecraft-bedrock-types/lib/types';
import { MolangDataSetKey } from "bc-minecraft-molang";
import { MolangSet } from 'bc-minecraft-molang/lib/src/molang';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../types';

/**
 * The user of the resource, the user should have the nessecary things defined for the resource to use
 */
export interface User extends Identifiable {
  id: string;
  defined: Set<string>;
  type: MolangDataSetKey;
}

/**
 * The resource that has molang / statements that require to be defined
 */
export interface Resource extends Identifiable {
  id: string;
  molang: MolangSet;
}

/**
 * Diagnoses the given molang sets, the using party checks upon the definer if they have setup properly
 * @param using The set of molang data that is being used
 * @param definer The set of molang data that is defined
 * @param diagnoser The diagnoser to report to
 */
export function diagnose_molang_implementation(
  user: User,
  resource: Resource,
  diagnoser: DiagnosticsBuilder
): void {
  const resAssign = definedByResource(resource.molang);

  for (let res of resource.molang.using.values()) {
    const identifier = `${res.scope}.${res.names.join('.')}`;

    if (user.defined.has(identifier) || resAssign.has(identifier)) continue;

    diagnoser.add(
      user.id,
      `${identifier} is used by, but no definition is found by: ${user.type} with id: ${user.id}`,
      DiagnosticSeverity.error,
      `molang.${res.scope}.undefined`
    );
  }
}

function definedByResource(data: MolangSet): Set<string> {
  const set = new Set<string>();
  for (const item of data.assigned.values()) {
    set.add(`${item.scope}.${item.names.join('.')}`);
  }

  return set;
}