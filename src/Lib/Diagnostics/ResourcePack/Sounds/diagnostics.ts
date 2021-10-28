import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";

export function diagnose_resourcepack_sounds(data: Types.Definition | undefined, diagnoser: DiagnosticsBuilder): void {
  if (data === undefined) return;

  const pdata = diagnoser.context.getCache();

  Types.Definition.forEach(data, (ref, id) => {
    if (pdata.ResourcePacks.sounds.has(id)) return;

    diagnoser.Add(ref + "/" + id, `Cannot find sound definition: ${id}`, DiagnosticSeverity.error, "resourpack.sound.missing");
  });
}
