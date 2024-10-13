import { DiagnosticsBuilderContent } from "../src/Lib/Types/DiagnosticsBuilder";
import { ProjectData, TextDocument } from "bc-minecraft-bedrock-project";
import { Manifest } from "bc-minecraft-bedrock-project/lib/src/internal/types";
import { MCProject } from "bc-minecraft-project";
import path from "path";

export namespace TestProjectData {
  export function createTestData(files: Map<string, string> | undefined = undefined): ProjectData {
    return createContext(files).getCache();
  }

  export function createContext<T extends TextDocument = TextDocument>(
    files: Map<string, string> | undefined = undefined
  ): DiagnosticsBuilderContent<T> {
    const context = new InternalTest<T>(undefined, files);
    const data = context.getCache();

    data.behaviorPacks.add(path.join("c:", "bp"), MCProject.createEmpty(), {} as Manifest);
    data.resourcePacks.add(path.join("c:", "rp"), MCProject.createEmpty(), {} as Manifest);

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

    if (out) return { uri: uri, getText: () => out } as T;

    return undefined;
  }

  getFiles(): string[] {
    return [];
  }

  getCache() {
    if (!this.__projectData) {
      return (this.__projectData = new ProjectData(this));
    }

    return this.__projectData;
  }
}
