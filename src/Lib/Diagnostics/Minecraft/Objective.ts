import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { Types } from "bc-minecraft-bedrock-types";
import { check_definition_value } from "../Definitions";

export function minecraft_objectives_diagnose(value: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  if (diagnoser.project.attributes["diagnostic.objective"] === "false") return;

  const id = value.text;

  //Length check
  if (id.length > 16) {
    diagnoser.Add(
      value,
      `The objective: ${id} is too long for an objective, it can be a maximum, of 16 characters long`,
      DiagnosticSeverity.error,
      "minecraft.objective.long"
    );
  }

  if (!/^[a-zA-Z0-9\-\_\.]+$/gmi.test(id)) {
    diagnoser.Add(value, `Illegal character found in objective: ${id}`, DiagnosticSeverity.error, "minecraft.objective.invalid");
  }

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.objective, id, diagnoser)) return;

  const data = diagnoser.context.getCache();

  //Project has defined
  if (data.General.objectives.has(id)) return;

  //Nothing then report error
  diagnoser.Add(value, `Cannot find objective definition: ${id}`, DiagnosticSeverity.error, "minecraft.objective.missing");
}
