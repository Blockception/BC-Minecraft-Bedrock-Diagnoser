# BC-Minecraft-Bedrock-Diagnoser

A typescript package library that provides diagnostics for minecraft bedrock projects

```ts
const context: DiagnoserContext = {
  getDiagnoser: (doc: TextDocument, project: MCProject) => { ... },
  getDocument: (uri: string) => { ... },
  getFiles: (folder: string, ignores: MCIgnore) => { ... },
  cache: ProjectData
};

const diagnoser = new Diagnoser(context);

diagnoser.Process(doc): boolean;
diagnoser.ProcessFolder(folder, ignores): void;
diagnoser.ProcessPack(pack): void;
```
