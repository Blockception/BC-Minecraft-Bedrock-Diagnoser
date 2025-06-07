import { check_definition_value, education_enabled } from "../../definitions";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { Types } from "bc-minecraft-bedrock-types";

export function behaviorpack_loot_table_diagnose(
  value: Types.OffsetWord | string,
  diagnoser: DiagnosticsBuilder
): boolean {
  const id = typeof value === "string" ? value : value.text;

  if (has_loot_table(id, diagnoser)) {
    return true;
  }

  //Nothing then report error
  diagnoser.add(
    value,
    `Cannot find behaviorpack loot_table definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.loot_table.missing"
  );
  return false;
}

export function behaviorpack_loot_table_short_diagnose(
  value: Types.OffsetWord | string,
  diagnoser: DiagnosticsBuilder
) {
  let id = typeof value === "string" ? value : value.text;

  //Strip ""
  if (id.startsWith('"')) {
    id = id.slice(1);
  }
  if (id.endsWith('"')) {
    id = id.slice(0, -1);
  }
  if (!id.startsWith("loot_tables/")) {
    id = "loot_tables/" + id;
  }
  if (!id.endsWith(".json")) {
    id = id + ".json";
  }

  if (has_loot_table(id, diagnoser)) {
    return true;
  }

  diagnoser.add(
    value,
    `Cannot find behaviorpack loot_table definition: ${id}`,
    DiagnosticSeverity.error,
    "behaviorpack.loot_table.missing"
  );
  return false;
}

function has_loot_table(id: string, diagnoser: DiagnosticsBuilder): boolean {
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.loot_table, id, diagnoser)) return true;
  const data = diagnoser.context.getProjectData().projectData;

  //Project has loot_table
  if (data.behaviorPacks.loot_tables.has(id)) return true;
  const edu = education_enabled(diagnoser);

  //Vanilla has loot_table
  if (MinecraftData.BehaviorPack.hasLootTable(id, edu)) return true;

  return false;
}
