import { check_definition_value, education_enabled } from "../../Definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/include";
import { MinecraftData } from 'bc-minecraft-bedrock-vanilla-data';
import { Types } from "bc-minecraft-bedrock-types";

export function behaviorpack_loot_table_diagnose(value: Types.OffsetWord | string, diagnoser: DiagnosticsBuilder): boolean {
  const id = typeof value === "string" ? value : value.text;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.loot_table, id, diagnoser)) return true;
  const data = diagnoser.context.getCache();

  //Project has loot_table
  if (data.BehaviorPacks.loot_tables.has(id)) return true;
  const edu = education_enabled(diagnoser);

  //Vanilla has loot_table
  if (MinecraftData.BehaviorPack.hasLootTable(id, edu)) return true;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find behaviorpack loot_table definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.loot_table.missing");
  return false;
}
