import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

export function diagnose_script(script: Internal.Script | undefined, Animations: Animation | undefined, builder: DiagnosticsBuilder): void {
  if (script === undefined) return;

  //TODO diagnoseif script is using proper animations
}
