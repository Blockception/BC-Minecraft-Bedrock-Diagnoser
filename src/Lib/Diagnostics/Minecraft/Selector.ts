import { ParameterInfo } from "bc-minecraft-bedrock-command/lib/src/Lib/Data/CommandInfo";
import { Text } from 'bc-minecraft-bedrock-project';
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../Lib/Types/DiagnosticsBuilder/include";
import { OffsetWord } from "../../Types/OffsetWord";
import { check_definition_value } from '../Definitions';

export function minecraft_selector_diagnose(pattern: ParameterInfo, value: OffsetWord, diagnoser: DiagnosticsBuilder) {
  const sel = value.text;

  //Is a selector?
  if (sel.startsWith("@")) {

    return;
  }
  //Fake entity or named then  
  const name = Text.UnQuote(sel);

  //Fake players have been banned
  if (pattern.options?.allowFakePlayers === false) {
    diagnoser.Add(value.offset, "No fake players / names allowed", DiagnosticSeverity.error, "minecraft.selector.invalid");
    return;
  }

  if (pattern.options?.playerOnly === true) {
    diagnoser.Add(value.offset, "Only players selector allowed to be used", DiagnosticSeverity.error, "minecraft.selector.invalid");
    return;
  }

  const data = diagnoser.context.getCache();  

  //Project has defined this fake entity
  if (data.General.fakeEntities.has(name)) return;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.names, name, diagnoser)) return;

  //Found nothing then report
  diagnoser.Add(value.offset, `Cannot find definition or name for: ${name}`, DiagnosticSeverity.warning, "minecraft.fakeentity.missing");
}
