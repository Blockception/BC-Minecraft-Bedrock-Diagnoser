import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from "../Definitions";

export function minecraft_tag_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if(diagnoser.project.attributes["diagnostic.tag"] === "false") return;

  const id = value.text;
  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.tag, id, diagnoser)) return;
  
  const data = diagnoser.context.getCache();

  //Project has defined  
  if (data.General.tags.has(id)) return;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find tag definition: ${id}`, DiagnosticSeverity.error, "minecraft.tag.missing");
}
