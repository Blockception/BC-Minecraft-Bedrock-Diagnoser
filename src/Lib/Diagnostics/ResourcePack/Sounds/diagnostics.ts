import { Types } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types";
import { DiagnosticSeverity } from "../../../Types/Severity";
import { education_enabled } from "../../Definitions";

export function diagnose_resourcepack_sounds(data: Types.Definition | undefined, diagnoser: DiagnosticsBuilder): void {
  if (data === undefined) return;

  const pdata = diagnoser.context.getCache();
  const edu = education_enabled(diagnoser);

  Types.Definition.forEach(data, (ref, id) => {
    if (pdata.ResourcePacks.sounds.has(id)) return;
    if (MinecraftData.ResourcePack.hasSound(id, edu)) return;

    diagnoser.Add(
      ref + "/" + id,
      `Cannot find sound definition: ${id}`,
      DiagnosticSeverity.error,
      "resourcepack.sound.missing"
    );
  });
}
