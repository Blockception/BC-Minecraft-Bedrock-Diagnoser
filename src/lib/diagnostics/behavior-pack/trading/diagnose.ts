import { Types } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { check_definition_value, education_enabled } from "../../definitions";

export function behaviorpack_trading_diagnose(
  value: Types.OffsetWord | string,
  diagnoser: DiagnosticsBuilder
): boolean {
  const id = typeof value === "string" ? value : value.text;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.trading, id, diagnoser)) return true;
  const data = diagnoser.context.getProjectData().projectData;

  //Project has loot_table
  if (data.behaviorPacks.trading.has(id)) return true;
  const edu = education_enabled(diagnoser);

  //Vanilla has loot_table
  if (MinecraftData.BehaviorPack.hasTrading(id, edu)) return true;

  //Nothing then report error
  diagnoser.add(
    value,
    `Cannot find behaviorpack trading definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.trading.missing"
  );
  return false;
}
