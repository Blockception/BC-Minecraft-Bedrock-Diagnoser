import { Pack, PackType, TextDocument } from "bc-minecraft-bedrock-project";
import { MCIgnore } from "bc-minecraft-project";
import { BehaviorPack } from "../../Diagnostics/BehaviorPack/BehaviorPack";
import { ResourcePack } from "../../Diagnostics/ResourcePack/ResourcePack";
import { DiagnoserContext } from "./DiagnoserContext";

/**The object that is responsible for diagnosing minecraft bedrock files*/
export class Diagnoser {
  /**The context needed to perform diagnostics*/
  readonly context: DiagnoserContext;

  /**Create a new instance of Diagnoser
   * @param context The context needed to perform diagnostics*/
  constructor(context: DiagnoserContext) {
    this.context = context;
  }

  /** Process and diagnoses the given document
   * @param doc The textdocument to process or the uri to the document
   * @returns `true` or `false` if the diagnostics was successfull*/
  Process(doc: TextDocument | string): boolean {
    if (typeof doc === "string") {
      const temp = this.context.getDocument(doc);

      if (!temp) return false;
      doc = temp;
    }

    const pack = this.context.getCache().get(doc);
    if (!pack) return false;

    const diagnoser = this.context.getDiagnoser(doc, pack.context);
    if (!diagnoser) return false;

    switch (PackType.detect(doc.uri)) {
      case PackType.behavior_pack:
        BehaviorPack.Process(doc, diagnoser);
        break;

      case PackType.resource_pack:
        ResourcePack.Process(doc, diagnoser);
        break;
    }

    diagnoser.done();

    return true;
  }

  /**Diagnoses the entire given folder
   * @param folder The folder to retrieve files of
   * @param ignores The pattern to ignore on files*/
  ProcessFolder(folder: string, ignores: MCIgnore): void {
    const files = this.context.getFiles(folder, ignores);

    for (let I = 0; I < files.length; I++) {
      this.Process(files[I]);
    }
  }

  /**
   *
   * @param pack
   */
  ProcessPack(pack: Pack): void {
    this.ProcessFolder(pack.folder, pack.context.ignores);
  }
}
