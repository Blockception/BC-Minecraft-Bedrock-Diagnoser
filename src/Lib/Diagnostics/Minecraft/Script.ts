import { Script } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../main";

export function diagnose_script(script: Script | undefined, Animations: Animation | undefined, builder: DiagnosticsBuilder): void {
  if (script === undefined) return;

  //TODO diagnoseif script is using proper animations
}
