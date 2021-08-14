import { DiagnosticsBuilder } from '../../Types/DiagnosticsBuilder/DiagnosticsBuilder';

export namespace Block {
  export function Diagnose(blockid : string, location : , diagnoser : DiagnosticsBuilder) : void {
    
    const cache = diagnoser.context.getCache();
    cache.BehaviorPacks.blocks.has(blockid)
  }
}
