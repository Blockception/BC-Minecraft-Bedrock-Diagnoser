import { TextDocument, Map } from "bc-minecraft-bedrock-project";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { education_enabled } from "../../Definitions";
import { Json } from "../../Json/Json";

/**Diagnoses the given document as a texture atlas
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function DiagnoseAtlas(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const defintions = Json.LoadReport<TextureAtlas>(doc, diagnoser);
  if (!TextureAtlas.is(defintions)) return;

  //Get pack for files search
  const pack = diagnoser.context.getCache().ResourcePacks.get(doc.uri);
  if (pack === undefined) return;

  const texture_data = defintions.texture_data;
  const texture_files = diagnoser.context
    .getFiles(pack.folder, pack.context.ignores)
    .filter((item) => item.includes("textures"))
    .map((item) => item.replace(/\\/gi, "/"));

  Map.forEach(texture_data, (data, texture_id) => {
    if (typeof data.textures === "string") {
      texture_files_diagnose(texture_id, data.textures, texture_files, diagnoser);
    } else {
      data.textures.forEach((texture) => {
        if (typeof texture === "string") {
          texture_files_diagnose(texture_id, texture, texture_files, diagnoser);
        }
      });
    }
  });
}

/**Diagnoses the given document as a texture flipbook file
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function DiagnoseFlipbook(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //TODO add rp diagnostics
}

function texture_files_diagnose(owner: string, file: string, files: string[], diagnoser: DiagnosticsBuilder): void {
  for (let I = 0; I < files.length; I++) {
    if (files[I].includes(file)) {
      //Found then remove
      return;
    }
  }

  if (MinecraftData.ResourcePack.hasTexture(file, education_enabled(diagnoser))) return;

  diagnoser.Add(`${owner}/${file}`, `Cannot find file: ${file}`, DiagnosticSeverity.error, "resourpack.texture.missing");
}

interface TextureAtlas {
  resource_pack_name?: string;
  texture_name?: string;
  texture_data: Map<TextureSpec>;
}

namespace TextureAtlas {
  export function is(value: any): value is TextureAtlas {
    if (typeof value === "object" && typeof value.texture_data === "object") return true;

    return false;
  }
}

interface TextureSpec {
  textures: string | (string | DetailedTextureSpec)[];
}

interface DetailedTextureSpec {
  variations?: { path?: string }[];
}
