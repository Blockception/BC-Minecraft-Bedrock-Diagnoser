import { MolangFullSet } from "bc-minecraft-molang";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { diagnose_molangfull } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function render_controller_diagnose_implementation(id: string, data: MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  if (has_render_controller(id, diagnoser)) {
    molang_render_controller(id, data, diagnoser);
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
  if (cache.ResourcePacks.render_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has render controller
  if (MinecraftData.ResourcePack.hasRenderController(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(id, `Cannot find render controller: ${id}`, DiagnosticSeverity.error, "resourcepack.render_controller.missing");
  return false;
}

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function molang_render_controller(id: string, data: MolangFullSet, diagnoser: DiagnosticsBuilder): void {
  const cache = diagnoser.context.getCache();

  //Project has render controller
  const rp = cache.ResourcePacks.render_controllers.get(id);

  if (!rp) return;

  diagnose_molangfull(rp.molang, data, diagnoser);
}
