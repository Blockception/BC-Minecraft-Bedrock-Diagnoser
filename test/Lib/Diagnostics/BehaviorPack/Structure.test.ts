import { ProjectData, TextDocument } from "bc-minecraft-bedrock-project";
import { behaviorpack_structure_diagnose } from "../../../../src/Lib/Diagnostics/BehaviorPack/Structure";
import { TestDiagnoser } from "../../../diagnoser";

describe("BehaviorPack", () => {
  describe("Structures", () => {
    var diagnoser: TestDiagnoser<TextDocument>;
    var data: ProjectData;

    beforeEach(() => {
      diagnoser = TestDiagnoser.create();
      data = diagnoser.context.getCache();
    });

    it("quotes", () => {
      data.behaviorPacks.packs[0].structures.set({
        id: "test/example",
        documentation: "",
        location: { position: 0, uri: "" },
      });

      behaviorpack_structure_diagnose({ offset: 0, text: "test/example" }, diagnoser);
      behaviorpack_structure_diagnose({ offset: 0, text: "test:example" }, diagnoser);

      diagnoser.expectAmount(1);
    });

    it("no errors", () => {
      data.behaviorPacks.packs[0].structures.set({
        id: '"test/example"',
        documentation: "",
        location: { position: 0, uri: "" },
      });

      behaviorpack_structure_diagnose({ offset: 0, text: '"test/example"' }, diagnoser);
      behaviorpack_structure_diagnose({ offset: 0, text: '"test:example"' }, diagnoser);

      diagnoser.expectEmpty();
    });

    it("missing", () => {
      data.behaviorPacks.packs[0].structures.set({
        id: '"test/example"',
        documentation: "",
        location: { position: 0, uri: "" },
      });

      behaviorpack_structure_diagnose({ offset: 0, text: '"t/example"' }, diagnoser);
      behaviorpack_structure_diagnose({ offset: 0, text: '"t:example"' }, diagnoser);

      diagnoser.expectAmount(2);
    });
  });
});
