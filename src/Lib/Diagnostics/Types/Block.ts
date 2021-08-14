import { Location } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../Types/DiagnosticsBuilder/DiagnosticsBuilder";

export namespace Block {
  export function Diagnose(blockid: string, location: Location, diagnoser: DiagnosticsBuilder): void {
    const cache = diagnoser.context.getCache();
    cache.BehaviorPacks.blocks.has(blockid);
  }
}
