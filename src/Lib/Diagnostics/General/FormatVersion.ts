import { FormatVersion } from "bc-minecraft-bedrock-types/lib/src/minecraft";
import { Versions } from "bc-minecraft-bedrock-vanilla-data/lib/src/Lib";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../Types";

interface FormatVersionContainer {
  format_version: FormatVersion;
}

namespace FormatVersionContainer {
  export function is(value: any): value is FormatVersionContainer {
    if (value && typeof value === "object") {
      if (typeof value.format_version === "string") return true;
    }

    return false;
  }
}

const latestVersion = FormatVersion.parse(Versions.latest);

export function diagnoseFormatVersionIf(
  data: Partial<FormatVersionContainer>,
  diagnoser: DocumentDiagnosticsBuilder
): void {
  if (FormatVersionContainer.is(data)) diagnoseFormatVersion(data, diagnoser);
}

export function diagnoseFormatVersion(data: FormatVersionContainer, diagnoser: DocumentDiagnosticsBuilder): void {
  const location = `format.version/${data.format_version ?? ""}`;

  if (typeof data.format_version !== "string") {
    return diagnoser.add(
      "Format version is not a string",
      location,
      DiagnosticSeverity.error,
      "minecraft.format_version"
    );
  }

  let v;
  try {
    v = FormatVersion.parse(data.format_version);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return diagnoser.add(
      "Format version is not a valid number",
      location,
      DiagnosticSeverity.error,
      "minecraft.format_version"
    );
  }

  // If version is less then latest recommend upgrade

  for (let I = 0; I < 3; I++) {
    if (latestVersion[I] > v[I]) {
      return diagnoser.add(
        `Format version is out of date, please upgrade to ${Versions.latest}`,
        location,
        DiagnosticSeverity.warning,
        "minecraft.format_version"
      );
    }
  }
}
