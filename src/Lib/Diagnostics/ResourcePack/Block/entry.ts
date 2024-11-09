import { ResourcePackCollection } from "bc-minecraft-bedrock-project/lib/src/project/resource-pack";
import { DiagnosticsBuilder, DiagnosticSeverity, DocumentDiagnosticsBuilder } from '../../../Types';
import { Json } from "../../Json/Json";

/**Diagnoses the given document as a block.json
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  const blocks = Json.LoadReport<Blocks>(diagnoser);

  if (!Json.TypeCheck(blocks, diagnoser, "blocks.json", "resourcepack.blocks.invalid", is)) return;

  const keys = Object.keys(blocks);
  const rp = diagnoser.context.getCache().resourcePacks;

  for (let I = 0; I < keys.length; I++) {
    const key = keys[I];
    if (key === "format_version") continue;

    const block = blocks[keys[I]];

    if (typeof block === "object") {
      const texture = block.textures;

      if (typeof texture === "string") {
        hasDefinition(key, texture, rp, diagnoser);
      } else if (texture) {
        if (texture.down) hasDefinition(key, texture.down, rp, diagnoser);
        if (texture.up) hasDefinition(key, texture.up, rp, diagnoser);
        if (texture.side) hasDefinition(key, texture.side, rp, diagnoser);

        if (texture.north) hasDefinition(key, texture.north, rp, diagnoser);
        if (texture.south) hasDefinition(key, texture.south, rp, diagnoser);
        if (texture.west) hasDefinition(key, texture.west, rp, diagnoser);
        if (texture.east) hasDefinition(key, texture.east, rp, diagnoser);
      }
    }
  }
}

function hasDefinition(block: string, value: string, rp: ResourcePackCollection, diagnoser: DiagnosticsBuilder): void {
  if (rp.textures.has(value)) return;

  diagnoser.add(
    `${block}/${value}`,
    "The texture is not defined in the terrain_texture.json",
    DiagnosticSeverity.error,
    "resourcepack.texture.undefined"
  );
}

interface Blocks {
  [block_id: string]: {
    sound?: string;
    textures:
      | string
      | {
          down?: string;
          up?: string;
          side?: string;
          east?: string;
          north?: string;
          south?: string;
          west?: string;
        };
  };
}

function is(value: any): value is Blocks {
  if (typeof value === "object") {
    return true;
  }

  return false;
}
