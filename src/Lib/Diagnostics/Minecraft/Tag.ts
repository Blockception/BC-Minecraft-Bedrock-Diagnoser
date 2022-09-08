import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from "../Definitions";

export function minecraft_tag_diagnose(value: Types.OffsetWord | string, diagnoser: DiagnosticsBuilder): void {
  if (diagnoser.project.attributes["diagnostic.tag"] === "false") return;

  const id = typeof value === "string" ? value : value.text;

  //Empty tags are valid as they are used to represent either no items or any items
  if (id === "") return;

  if (!/^[a-zA-Z0-9\-\_\.]+$/gim.test(id)) {
    diagnoser.Add(value, `Illegal character found in tag: ${id}`, DiagnosticSeverity.error, "minecraft.tag.invalid");
  }

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tag, id, diagnoser)) return;

  const data = diagnoser.context.getCache();

  //Project has defined
  if (data.General.tags.has(id)) return;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find tag definition: ${id}`, DiagnosticSeverity.error, "minecraft.tag.missing");
}
