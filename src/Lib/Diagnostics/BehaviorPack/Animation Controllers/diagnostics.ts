import { Map } from "bc-minecraft-bedrock-project";
import { AnimationCarrier, MolangCarrier } from "bc-minecraft-bedrock-project/lib/src/Lib/Types/Carrier/Carrier";
import { Types } from "bc-minecraft-bedrock-types";
import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { general_animation_controllers_implementation } from "../../Minecraft/Animation Controllers";
import { OwnerType } from "../../Molang/diagnostics";

/**
 *
 * @param id
 * @param data
 * @param diagnoser
 */
export function animation_controller_diagnose_implementation(
  controllerid: string,
  user: Types.Identifiable & MolangCarrier<Molang.MolangSet | Molang.MolangFullSet> & AnimationCarrier<DefinedUsing<string>> & { events?: Map<any> },
  ownerType: OwnerType,
  diagnoser: DiagnosticsBuilder
): void {
  if (has_animation_controller(controllerid, diagnoser)) {
    const controller = diagnoser.context.getCache().BehaviorPacks.animation_controllers.get(controllerid);

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
  if (cache.BehaviorPacks.animation_controllers.has(id)) return true;

  //Nothing then report error
  diagnoser.Add(
    `"${id}"`,
    `Cannot find behaviorpack animation_controller: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.animation_controller.missing"
  );
  return false;
}
