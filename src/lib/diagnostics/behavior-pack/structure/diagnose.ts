import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { check_definition_value } from "../../definitions";

export function behaviorpack_structure_diagnose(value: Types.OffsetWord | string, diagnoser: DiagnosticsBuilder): boolean {
  const id = typeof value == 'string' ? value : value.text;

  //If it has a slash it needs ""
  if (id.includes("/")) {
    if (id.startsWith('"') && id.endsWith('"')) {
      // Do nothing
    } else {
      diagnoser.add(
        value,
        `A structure id with '/' needs quotes surrounding it: ${id} => "${id}"`,
        DiagnosticSeverity.error,
        "behaviorpack.mcstructure.invalid"
      );
    }
  }

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.structure, id, diagnoser)) return true;
  const data = diagnoser.context.getCache();

  //Project has structure
  if (data.behaviorPacks.structures.has(id)) return true;
  if (data.general.structures.has(id)) return true;

  //structures can be identified with : or /
  if (id.includes(":")) {
    const cid = id.replace('mystructure:', '').replace(":", "/");

    if (check_definition_value(diagnoser.project.definitions.structure, cid, diagnoser)) return true;
    if (data.behaviorPacks.structures.has(cid)) return true;
    if (data.general.structures.has(cid)) return true;
  }

  //Nothing then report error
  diagnoser.add(
    value,
    `Cannot find behaviorpack mcstructure: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.mcstructure.missing"
  );
  return false;
}
