import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder";
import { TextDocument } from '../../../Types/Interfaces';
import { Json } from "../../Json/Json";
import { texture_files_diagnose } from "./entry";

/**Diagnoses the given document as a texture flipbook file
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function DiagnoseFlipbook(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const flipbooks = Json.LoadReport<FlipbookTexture[]>(doc, diagnoser);

  if (flipbooks === undefined) return;
  if (!Array.isArray(flipbooks)) return;

  const pack = diagnoser.context.getCache().ResourcePacks.get(doc.uri);
  if (pack === undefined) return;

  const texture_files = diagnoser.context.getFiles(pack.folder, ["**/textures/**/*.{tga,png,jpg,jpeg}"], pack.context.ignores).map((item) => item.replace(/\\/gi, "/"));

  for (let I = 0; I < flipbooks.length; I++) {
    const flipbook = flipbooks[I];

    if (isFlipbook(flipbook)) {
      texture_files_diagnose("flipbook_texture", flipbook.flipbook_texture, texture_files, diagnoser);
    }
  }
}

interface FlipbookTexture {
  flipbook_texture: string;
}

function isFlipbook(value: any): value is FlipbookTexture {
  if (typeof value === "object") {
    if (typeof value.flipbook_texture === "string") return true;
  }

  return false;
}
