import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { check_definition_value } from "../../definitions";

export function diagnose_structure_implementation(
  id: Types.OffsetWord | string,
  diagnoser: DiagnosticsBuilder
): boolean {
  const strId = typeof id === "string" ? id : id.text;

  //If it has a slash it needs ""
  if (strId.includes("/")) {
    if (strId.startsWith('"') && strId.endsWith('"')) {
      // Do nothing
    } else {
      diagnoser.add(
        id,
        `A structure id with '/' needs quotes surrounding it: ${strId} => "${strId}"`,
        DiagnosticSeverity.error,
        "behaviorpack.mcstructure.invalid"
      );
    }

    //Project has trading
    const trade = diagnoser.context.getProjectData().behaviors.trading.get(strId, diagnoser.project);
    if (trade !== undefined) {
      return true;
    }
  }

  const data = diagnoser.context.getProjectData().projectData;
  if (data.general.structures.has(strId)) return true;

  //structures can be identified with : or /
  if (strId.includes(":")) {
    let cid = strId.replace("mystructure:", "").replace(":", "/");
    if (!cid.includes("/")) cid = cid.replace(/"/g, "");
    if (check_definition_value(diagnoser.project.definitions.structure, cid, diagnoser)) return true;
    if (data.behaviorPacks.structures.has(cid)) return true;
    if (data.general.structures.has(cid)) return true;
  }

  //Nothing then report error
  diagnoser.add(
    id,
    `Cannot find behaviorpack mcstructure: ${strId}`,
    DiagnosticSeverity.error,
    "behaviorpack.mcstructure.missing"
  );
  return false;
}
