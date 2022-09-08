import { DiagnosticsBuilderContent } from "../src/Lib/Types/DiagnosticsBuilder";
import { ProjectData, TextDocument } from "bc-minecraft-bedrock-project";
import { MCIgnore, MCProject } from "bc-minecraft-project";
import path = require("path");

export namespace TestProjecData {
  export function CreateTestData(files: Map<string, string> | undefined = undefined): ProjectData {
    return CreateContext(files).getCache();
  }

  export function CreateContext(files: Map<string, string> | undefined = undefined): DiagnosticsBuilderContent {
    const context = new InternalTest(undefined, files);

    const data = context.getCache();

    data.BehaviorPacks.add(path.join("c:", "bp"), MCProject.createEmpty());
    data.ResourcePacks.add(path.join("c:", "rp"), MCProject.createEmpty());

    return context;
  }
}

export class InternalTest implements DiagnosticsBuilderContent {
  public __projecdata: ProjectData | undefined;
  public __files: Map<string, string>;

  constructor(projectdata: ProjectData | undefined, files: Map<string, string> | undefined) {
    this.__projecdata = projectdata;
    this.__files = files ?? new Map<string, string>();
  }

  getDocument(uri: string): TextDocument | undefined {
    const out = this.__files.get(uri);

    if (out) return { uri: uri, getText: (range) => out };

    return undefined;
  }
  
  getFiles(folder: string, patterns : string[], ignores: MCIgnore): string[] {
    return [];
  }

  getCache() {
    if (!this.__projecdata) {
      return (this.__projecdata = new ProjectData(this));
    }

    return this.__projecdata;
  }
}
