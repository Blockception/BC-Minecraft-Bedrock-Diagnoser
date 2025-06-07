import { MinecraftData } from 'bc-minecraft-bedrock-project';
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../types";



type PackType = keyof Exclude<MinecraftData, "projectData">;
type SubType<T extends PackType> = keyof MinecraftData[T];

/**
 *
 * @param pack
 * @param subtype
 * @param id
 * @param diagnoser
 * @returns
 */
export function missing<T extends PackType>(
  pack: T,
  subtype: SubType<T>,
  id: string,
  diagnoser: DiagnosticsBuilder
) {

  let p: string;
  switch (pack) {
    case "behaviors":
      p = "behaviorpack";
      break;
    case "resources":
      p = "resourcepack";
      break;
    default:
      p = pack;
  }

  diagnoser.add(
    `"${id}"`,
    `Cannot find ${p} ${String(subtype)}: ${id}`,
    DiagnosticSeverity.error,
    `${p}.${String(subtype)}.missing`
  );
}
