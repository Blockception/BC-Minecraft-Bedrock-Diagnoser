import { DiagnosticsBuilder, DiagnosticSeverity } from "../../types";

/**
 *
 * @param pack
 * @param subtype
 * @param id
 * @param diagnoser
 * @returns
 */
export function missing(
  pack: "resource_pack" | "behavior_pack",
  subtype: string,
  id: string,
  diagnoser: DiagnosticsBuilder
) {
  diagnoser.add(
    `"${id}"`,
    `Cannot find ${pack} ${subtype}: ${id}`,
    DiagnosticSeverity.error,
    `${pack}.${subtype}.missing`
  );
}
