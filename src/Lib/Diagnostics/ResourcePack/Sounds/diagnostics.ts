import { Types } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types';
import { education_enabled } from "../../Definitions";

export function diagnose_resourcepack_sounds(data: Types.Definition | undefined, diagnoser: DiagnosticsBuilder): void {
  if (data === undefined) return;

  const pdata = diagnoser.context.getCache();
  const edu = education_enabled(diagnoser);

  Types.Definition.forEach(data, (ref, id) => {
    if (pdata.resourcePacks.sounds.has(id)) return;
    if (MinecraftData.ResourcePack.hasSound(id, edu)) return;

    diagnoser.add(
      ref + "/" + id,
      `Cannot find sound definition: ${id}`,
      DiagnosticSeverity.error,
      "resourcepack.sound.missing"
    );
  });
}

export function diagnose_resourcepack_sound(id: string, diagnoser: DiagnosticsBuilder): void {
  if (id === undefined) return;

  const pdata = diagnoser.context.getCache();
  const edu = education_enabled(diagnoser);

  if (pdata.resourcePacks.sounds.has(id)) return;
  if (MinecraftData.ResourcePack.hasSound(id, edu)) return;

  diagnoser.add(
    id,
    `Cannot find sound definition: ${id}`,
    DiagnosticSeverity.error,
    "resourcepack.sound.missing"
  );

}