import { TextDocument } from 'bc-minecraft-bedrock-project';
import { DiagnosticsBuilder } from '../../../Types/DiagnosticsBuilder/DiagnosticsBuilder';
import { Json } from '../../Json/Json';


/**Diagnoses the given document as a texture flipbook file
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
 export function DiagnoseFlipbook(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const flipbooks = Json.LoadReport<FlipbookTexture[]>(doc, diagnoser);

  
}

interface FlipbookTexture {
  flipbook_texture: string
}