
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types/DiagnosticsBuilder/include';
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from '../../Definitions';

export function behaviorpack_structure_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): boolean {
  const id = value.text;

  //If it has a slash it needs ""
  if (id.includes('/')) {
    if (id.startsWith('"') && id.endsWith('"')) {

    }
    else {
      diagnoser.Add(value, `A structure id with '/' needs quotes surrounding it: ${id} => "${id}"`, DiagnosticSeverity.error, "behaviorpack.mcstructure.invalid");
    }
  }

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.structure, id, diagnoser)) return true;

  const data = diagnoser.context.getCache();

  //Project has structure
  if (data.BehaviorPacks.structures.has(id)) return true;
  if (data.General.structures.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find behaviorpack mcstructure: ${id}`, DiagnosticSeverity.error, "behaviorpack.mcstructure.missing");
  return false;
}
