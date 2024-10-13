import { Types } from "bc-minecraft-bedrock-types";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types";
import { check_definition_value } from "../Definitions";

export function minecraft_tag_diagnose(value: Types.OffsetWord | string, diagnoser: DiagnosticsBuilder): boolean {
  if (diagnoser.project.attributes["diagnostic.tags"] === "false") {
    return true;
  }

  const id = typeof value === "string" ? value : value.text;

  //Empty tags are valid as they are used to represent either no items or any items
  if (id === "") {
    return true;
  }

  if (!/^[a-zA-Z0-9\-_.]+$/gim.test(id)) {
    diagnoser.add(value, `Illegal character found in tag: ${id}`, DiagnosticSeverity.error, "minecraft.tag.invalid");
  }

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tag, id, diagnoser)) {
    return true;
  }

  const data = diagnoser.context.getCache();

  //Project has defined
  if (data.general.tags.has(id)) {
    return true;
  }

  //Nothing then report error
  diagnoser.add(value, `Cannot find tag definition: ${id}`, DiagnosticSeverity.error, "minecraft.tag.missing");
  return false;
}
