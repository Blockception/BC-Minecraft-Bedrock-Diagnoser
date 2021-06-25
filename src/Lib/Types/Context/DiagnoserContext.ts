import { ProjectData, TextDocument } from "bc-minecraft-bedrock-project";
import { MCIgnore } from "bc-minecraft-project";

export interface DiagnoserContext {
  /** */
  getDocument(uri: string): TextDocument | undefined;

  /** */
  getFiles(folder: string, ignores: MCIgnore): string[];

  /** */
  cache: ProjectData;
}
