import { DefinedUsing, MolangFullSet, MolangSet } from "bc-minecraft-molang";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { OwnerType } from "../../Molang/diagnostics";
import { Types } from "bc-minecraft-bedrock-types";
import { AnimationCarrier, MolangCarrier } from "bc-minecraft-bedrock-project/lib/src/Lib/Types/Carrier/Carrier";
import { general_animation_controllers_implementation } from '../../Minecraft/Animation Controllers';

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  controllerid: string,
  user: Types.Identifiable & MolangCarrier<MolangSet | MolangFullSet> & AnimationCarrier<DefinedUsing<string>>,
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder
): void {
  
  if (has_animation_controller(controllerid, diagnoser)) {
    const controller = diagnoser.context.getCache().ResourcePacks.animation_controllers.get(controllerid);

    if (!controller) return;

    general_animation_controllers_implementation(controller, user, ownerType, diagnoser);
  }
}

/**
 *
 * @param id
 * @param diagnoser
 * @returns
 */
export function has_animation_controller(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const cache = diagnoser.context.getCache();

  //Project has animation controller
  if (cache.ResourcePacks.animation_controllers.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has animation controller
  if (MinecraftData.ResourcePack.hasAnimationController(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(
    `"${id}"`,
    `Cannot find resourcepack animation controller: ${id}`,
    DiagnosticSeverity.error,
    "resourcepack.animation_controller.missing"
  );
  return false;
}
