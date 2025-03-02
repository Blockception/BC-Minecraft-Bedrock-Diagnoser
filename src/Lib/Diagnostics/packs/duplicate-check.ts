import { IDataSet } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../Types";
import { PackStringType } from "../../constants/packs";

export function no_other_duplicates<T extends Types.Identifiable & Types.Locatable>(
  diagPrefix: `${PackStringType}.${string}`,
  set: IDataSet<T>,
  id: string,
  diagnoser: DocumentDiagnosticsBuilder
) {
  const uri = diagnoser.document.uri;

  set.forEach((current) => {
    if (current.id === id && current.location.uri !== uri)
      diagnoser.add(
        `identifier/${id}`,
        `"${id}" has been defined multiple times:\n${uri}\n${current.location.uri}`,
        DiagnosticSeverity.warning,
        `${diagPrefix}.duplicate_id`
      );
  });
}
