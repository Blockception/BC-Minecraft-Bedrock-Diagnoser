import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { MinecraftData, Types } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { diagnose_molang_implementation, OwnerType } from "../../Molang/diagnostics";
import { AnimationCarrier, MolangCarrier } from 'bc-minecraft-bedrock-project/lib/src/Lib/Types/Carrier/Carrier';




/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_diagnose_implementation(
  anim_id: string,
  user: Types.Identifiable & MolangCarrier<Molang.MolangSet | Molang.MolangFullSet> & AnimationCarrier<DefinedUsing<string>>,
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder
): void {
  if (has_animation(anim_id, diagnoser)) {
    //Project has animation
    const anim = diagnoser.context.getCache().BehaviorPacks.animations.get(anim_id);

    if (!anim) return;

    diagnose_molang_implementation(anim, user, ownerType, diagnoser);
  }
  
  //TODO add particle check
  //TODO add sound check
}

/**
 *
 * @param id
 * @param diagnoser
 * @returns
 */
export function has_animation(id: string, diagnoser: DiagnosticsBuilder): boolean {
  const cache = diagnoser.context.getCache();

  //Project has render controller
  if (cache.ResourcePacks.animations.has(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has render controller
  if (MinecraftData.ResourcePack.hasAnimation(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(`"${id}"`, `Cannot find resourcepack animation: ${id}`, DiagnosticSeverity.error, "resourcepack.animation.missing");
  return false;
}
