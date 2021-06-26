import { Pack, PackType, TextDocument } from "bc-minecraft-bedrock-project";
import { MCIgnore } from "bc-minecraft-project";
import { BehaviorPack } from "../../Diagnostics/BehaviorPack/BehaviorPack";
import { ResourcePack } from "../../Diagnostics/ResourcePack/ResourcePack";
import { DiagnoserContext } from "./DiagnoserContext";

/**
 *
 */
export class Diagnoser {
  /**
   *
   */
  readonly context: DiagnoserContext;

  /**
   *
   * @param context
   */
  constructor(context: DiagnoserContext) {
    this.context = context;
  }

  /**
   *
   * @param doc
   * @returns
   */
  Process(doc: TextDocument | string): boolean {
    if (typeof doc === "string") {
      const temp = this.context.getDocument(doc);

      if (!temp) return false;
      doc = temp;
    }

    const pack = this.context.cache.get(doc);
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

  /**
   *
   * @param folder
   * @param ignores
   */
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
