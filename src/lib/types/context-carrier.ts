import { TextDocument } from 'bc-minecraft-bedrock-project';
import { DiagnoserContext } from "./DiagnoserContext";

/**An object that carriers Diagnoser context*/
export interface DiagnoserContextCarrier<T extends TextDocument = TextDocument> {
  /**The context needed to diagnose*/
  readonly context: DiagnoserContext<T>;
}
