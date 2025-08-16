import { MinecraftData } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../types";
import { Types } from "bc-minecraft-bedrock-types";

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
  id: string | Types.DocumentLocation,
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

  if (typeof id === "string" && !id.includes("/")) {
    id = `"${id}"`;
  }

  diagnoser.add(
    id,
    `Cannot find ${p} ${String(subtype)} definition: ${id}`,
    DiagnosticSeverity.error,
    `${p}.${String(subtype)}.missing`
  );
}
