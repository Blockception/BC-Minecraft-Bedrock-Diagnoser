import { DiagnosticsBuilderContent } from "../src/Lib/Types/DiagnosticsBuilder";
import { ProjectData, TextDocument } from "bc-minecraft-bedrock-project";
import { MCIgnore, MCProject } from "bc-minecraft-project";
import path = require("path");

export namespace TestProjectData {
  export function createTestData(files: Map<string, string> | undefined = undefined): ProjectData {
    return createContext(files).getCache();
  }

  export function createContext<T extends TextDocument = TextDocument>(files: Map<string, string> | undefined = undefined): DiagnosticsBuilderContent<T> {
    const context = new InternalTest<T>(undefined, files);

    const data = context.getCache();

    data.BehaviorPacks.add(path.join("c:", "bp"), MCProject.createEmpty());
    data.ResourcePacks.add(path.join("c:", "rp"), MCProject.createEmpty());

    return context;
  }
}

export class InternalTest<T extends TextDocument = TextDocument> implements DiagnosticsBuilderContent<T> {
  public __projectData: ProjectData | undefined;
  public __files: Map<string, string>;

  constructor(projectData: ProjectData | undefined, files: Map<string, string> | undefined) {
    this.__projectData = projectData;
    this.__files = files ?? new Map<string, string>();
  }

  getDocument(uri: string): T | undefined {
    const out = this.__files.get(uri);

    if (out) return { uri: uri, getText: (range) => out } as T;

    return undefined;
  }
  
  getFiles(folder: string, patterns : string[], ignores: MCIgnore): string[] {
    return [];
  }

  getCache() {
    if (!this.__projectData) {
      return (this.__projectData = new ProjectData(this));
    }

    return this.__projectData;
  }
}
