import { Pack, PackType, TextDocument } from "bc-minecraft-bedrock-project";
import { MCIgnore } from "bc-minecraft-project";
import path = require('path');
import { BehaviorPack } from "../../Diagnostics/BehaviorPack/BehaviorPack";
import { SkinPack } from "../../Diagnostics/SkinPack/SkinPack";
import { WorldPack } from "../../Diagnostics/WorldPack/WorldPack";
import { format_diagnose_path } from '../../Diagnostics/Format/diagnose';
import { minecraft_language_diagnose } from '../../Diagnostics/Minecraft/Language';
import { ResourcePack } from "../../Diagnostics/ResourcePack/ResourcePack";
import { DiagnosticSeverity } from "../DiagnosticsBuilder/Severity";
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
    
    //Check if diagnostics was disabled
    const ext = path.extname(doc.uri);
    
    //Check if diagnostics for this file type is disabled
    if (pack.context.attributes["diagnostic" + ext] === "false") return false;

    const diagnoser = this.context.getDiagnoser(doc, pack.context);
    if (!diagnoser) return false;

    let out = false;

    try {
      //diagnose path
      format_diagnose_path(pack, doc.uri, diagnoser);

      //Language file?
      if (doc.uri.endsWith(".lang")) {
        minecraft_language_diagnose(doc, diagnoser);
      }
      else {
        //Check per pack
        switch (pack.type) {
          case PackType.behavior_pack:
            out = BehaviorPack.Process(doc, diagnoser);
            break;
  
          case PackType.resource_pack:
            out = ResourcePack.Process(doc, diagnoser);
            break;

          case PackType.skin_pack:
            out = SkinPack.Process(doc, diagnoser);
            break;

          case PackType.world:
            out = WorldPack.Process(doc, diagnoser);
            break;
        }
      }
    } catch (err: any) {
      let msg;

      if (err.message && err.stack) {
        msg = `${err.message}\n\t${err.stack}`;
      }
      else {
        msg = JSON.stringify(err);
      }      

      diagnoser.Add({ character: 0, line: 0 }, msg, DiagnosticSeverity.error, "diagnoser.internal.exception");
    }

    diagnoser.done();

    return out;
  }

  /**Diagnoses the entire given folder
   * @param folder The folder to retrieve files of
   * @param ignores The pattern to ignore on files*/
  ProcessFolder(folder: string, ignores: MCIgnore): boolean {
    const files = this.context.getFiles(folder, ["*"], ignores);
    let out = false;

    for (let I = 0; I < files.length; I++) {
      out ||= this.Process(files[I]);
    }

    return out;
  }

  /**Process the entire given pack
   * @param pack The pack to process
   * @returns True or false is something was processed*/
  ProcessPack(pack: Pack): boolean {
    return this.ProcessFolder(pack.folder, pack.context.ignores);
  }
}
