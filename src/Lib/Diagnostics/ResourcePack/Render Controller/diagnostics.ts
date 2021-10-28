import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { MinecraftData, Types } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { diagnose_molang_implementation, OwnerType } from '../../Molang/diagnostics';
import { AnimationCarrier, MolangCarrier } from 'bc-minecraft-bedrock-project/lib/src/Lib/Types/Carrier/Carrier';

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function render_controller_diagnose_implementation(  
  controllerid: string,
  user: Types.Identifiable & MolangCarrier<Molang.MolangSet | Molang.MolangFullSet> & AnimationCarrier<DefinedUsing<string>>,
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder): void {

  if (has_render_controller(controllerid, diagnoser)) {
    const cache = diagnoser.context.getCache();

    //Project has render controller
    const rp = cache.ResourcePacks.render_controllers.get(controllerid);
  
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
  if (cache.ResourcePacks.render_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has render controller
  if (MinecraftData.ResourcePack.hasRenderController(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(id, `Cannot find render controller: ${id}`, DiagnosticSeverity.error, "resourcepack.render_controller.missing");
  return false;
}