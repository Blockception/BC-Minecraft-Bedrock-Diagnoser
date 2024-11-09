import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { MolangDataSetKey } from "bc-minecraft-molang";
import { DiagnosticsBuilder, DiagnosticSeverity, EntityAnimationMolangCarrier } from '../../../Types';
import { education_enabled } from "../../Definitions";
import { diagnose_molang_implementation } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function render_controller_diagnose_implementation(
  controllerId: string,
  user: EntityAnimationMolangCarrier,
  ownerType: MolangDataSetKey,
  diagnoser: DiagnosticsBuilder
): void {
  if (has_render_controller(controllerId, diagnoser)) {
    const cache = diagnoser.context.getCache();

    //Project has render controller
    const rp = cache.resourcePacks.render_controllers.get(controllerId);

    if (!rp) return;

    diagnose_molang_implementation(rp, user, ownerType, diagnoser);
  }
}

/**
 *
 * @param id
 * @param diagnoser
 * @returns
 */
export function has_render_controller(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const cache = diagnoser.context.getCache();

  //Project has render controller
  if (cache.resourcePacks.render_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has render controller
  if (MinecraftData.ResourcePack.hasRenderController(id, edu)) return true;

  //Nothing then report error
  diagnoser.add(
    id,
    `Cannot find render controller: ${id}`,
    DiagnosticSeverity.error,
    "resourcepack.render_controller.missing"
  );
  return false;
}
