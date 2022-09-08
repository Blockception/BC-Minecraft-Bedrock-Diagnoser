import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types";
import { Types } from "bc-minecraft-bedrock-types";
import { Text } from "bc-minecraft-bedrock-project";
import { check_definition_value } from "../Definitions";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";

export function minecraft_family_diagnose(value: Types.OffsetWord | string, diagnoser: DiagnosticsBuilder): boolean {
  const id = Text.UnQuote(typeof value === "string" ? value : value.text);

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.family, id, diagnoser)) return true;

  let out = false;

  const data = diagnoser.context.getCache();
  //Project has defined
  data.BehaviorPacks.entities.forEach((entity) => {
    if (entity.families.includes(id)) out = true;
  });

  if (out) return true;

  //Vanilla has defined
  if (MinecraftData.General.Entities.families.includes(id)) return true;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find family definition: ${id}`, DiagnosticSeverity.error, "minecraft.family.missing");
  return false;
}
