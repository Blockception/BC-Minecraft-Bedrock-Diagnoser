import { Documents, ProjectData } from "bc-minecraft-bedrock-project";
import { MCAttributes, MCDefinition, MCIgnore, MCProject } from "bc-minecraft-project";
import FastGlob from "fast-glob";
import { readFileSync } from "fs";
import path from "path";
import pm from "picomatch";
import { TextDocument } from "vscode-languageserver-textdocument";
import { Diagnoser, DiagnoserContext, DiagnosticsBuilderContent, ManagedDiagnosticsBuilder } from "../../src/main";
import { TestDocumentDiagnoser } from "../diagnoser";

class DocumentManager implements Documents<TextDocument> {
  getDocument(uri: string): TextDocument | undefined {
    const doc = readFileSync(uri, { encoding: "utf-8" });

    return TextDocument.create(uri, identifyDocument(uri), 1, doc);
  }
  getFiles(folder: string, patterns: string[], ignores: MCIgnore): string[] {
    return Glob.getFiles(patterns, ignores.patterns, folder);
  }
}

class TestContext implements DiagnosticsBuilderContent<TextDocument>, DiagnoserContext<TextDocument> {
  public diagnosers: TestDocumentDiagnoser<TextDocument>[] = [];

  constructor(private documentManager: DocumentManager, private projectData: ProjectData) {}
  getDocument(uri: string): TextDocument | undefined {
    return this.documentManager.getDocument(uri);
  }
  getFiles(folder: string, patterns: string[], ignores: MCIgnore): string[] {
    return this.getFiles(folder, patterns, ignores);
  }
  getCache(): ProjectData {
    return this.projectData;
  }
  getDiagnoser(doc: TextDocument, project: MCProject): ManagedDiagnosticsBuilder<TextDocument> | undefined {
    const diagnoser = new TestDocumentDiagnoser(doc, this, project);
    this.diagnosers.push(diagnoser);
    return diagnoser;
  }
}

namespace Glob {
  const opt: pm.PicomatchOptions = {
    contains: true,
  };

  /**
   *
   * @param source
   * @param ignores
   * @returns
   */
  export function excludes(source: string[], ignores: string[]): string[] {
    return source.filter((x) => !pm.isMatch(x, ignores, opt));
  }

  /**
   *
   * @param source
   * @param ignores
   * @param cwd The working directory
   * @param baseNameMatch
   * @returns
   */
  export function getFiles(
    source: string | string[],
    ignores: string[] | undefined = undefined,
    cwd: string | undefined = undefined,
    baseNameMatch: boolean | undefined = undefined
  ): string[] {
    const options: FastGlob.Options = { onlyFiles: true, absolute: true, cwd: cwd, baseNameMatch: baseNameMatch };
    let entries = FastGlob.sync(source, options);

    if (ignores && ignores.length > 0) entries = excludes(entries, ignores);

    return entries;
  }
}

namespace MinecraftFormat {
  export function getManifests(folder: string, ignores: string[]): string[] {
    return Glob.getFiles(["manifest.json", "**/manifest.json"], ignores, folder, true);
  }
  export function getBehaviorPackFiles(folder: string, ignores: string[]): string[] {
    return Glob.getFiles(
      ["**/*.{json,jsonc,json5}", "*.{json,jsonc,json5}", "*.mcfunction", "**/*.mcfunction", "**/*.lang", "*.lang"],
      ignores,
      folder
    );
  }
  export function getResourcePackFiles(folder: string, ignores: string[]): string[] {
    return Glob.getFiles(["**/*.{json,jsonc,json5}", "*.{json,jsonc,json5}", "**/*.lang", "*.lang"], ignores, folder);
  }
}

function identifyDocument(uri: string) {
  const ext = path.extname(uri);
  switch (ext) {
    case ".lang":
      return "bc-minecraft-language";
    case ".json":
      return "json";
    case ".mcfunction":
      return "bc-mcfunction";
    case ".molang":
      return "bc-minecraft-molang";
  }

  const filename = path.basename(uri);
  switch (filename) {
    case MCDefinition.filename:
    case MCIgnore.filename:
    case MCAttributes.filename:
      return "bc-minecraft-project";
  }

  return "bc-minecraft-other";
}

describe("Files test", () => {
  it("should be able to process and diagnose", async () => {
    const documentManager = new DocumentManager();
    const projectData = new ProjectData(documentManager);
    const mcproject = MCProject.createEmpty();
    const testContext = new TestContext(documentManager, projectData);
    const diagnoser = new Diagnoser(testContext);

    // Process
    const manifests = MinecraftFormat.getManifests(__dirname, mcproject.ignores.patterns);
    expect(manifests).toHaveLength(2);

    // process packs
    manifests.forEach((m) => projectData.addPack(m, mcproject));

    const bpFiles = MinecraftFormat.getBehaviorPackFiles(path.join(__dirname, "test-bp"), mcproject.ignores.patterns);
    const rpFiles = MinecraftFormat.getResourcePackFiles(path.join(__dirname, "test-rp"), mcproject.ignores.patterns);
    const files = [...bpFiles, ...rpFiles];
    files.forEach((f) => {
      console.log("processing", f);
      const t = documentManager.getDocument(f);
      expect(t).toBeDefined();
      if (!t) return;

      projectData.process(t);
    });

    // diagnose projects
    files.push(...manifests);
    files.forEach((f) => diagnoser.process(f));

    // validate
    let count = 0;
    for (const diag of testContext.diagnosers) {
      console.log("validating", diag.document.uri);
      diag.expectDone();
      count += diag.items.length;
    }

    expect(count).toBeGreaterThan(0);
  });
});
