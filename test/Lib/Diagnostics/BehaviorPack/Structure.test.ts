import { behaviorpack_structure_diagnose } from "../../../../src/Lib/Diagnostics/BehaviorPack/Structure/diagnose";
import { TestDiagnoser } from "../../../diagnoser";

describe("BehaviorPack", () => {
  describe("Structures", () => {
    it("no errors", () => {
      const diagnoser = TestDiagnoser.Create();
      const data = diagnoser.context.getCache();

      data.BehaviorPacks.packs[0].structures.set({
        id: '"test/example"',
        documentation: "",
        location: { position: 0, uri: "" },
      });

      behaviorpack_structure_diagnose({ offset: 0, text: '"test/example"' }, diagnoser);
      behaviorpack_structure_diagnose({ offset: 0, text: '"test:example"' }, diagnoser);

      diagnoser.expectEmpty();
    });

    it("quotes", () => {
      const diagnoser = TestDiagnoser.Create();
      const data = diagnoser.context.getCache();

      data.BehaviorPacks.packs[0].structures.set({
        id: 'test/example',
        documentation: "",
        location: { position: 0, uri: "" },
      });

      behaviorpack_structure_diagnose({ offset: 0, text: 'test/example' }, diagnoser);
      behaviorpack_structure_diagnose({ offset: 0, text: 'test:example' }, diagnoser);

      diagnoser.expectAmount(1)
    });

    it("missing", () => {
      const diagnoser = TestDiagnoser.Create();
      const data = diagnoser.context.getCache();

      data.BehaviorPacks.packs[0].structures.set({
        id: '"test/example"',
        documentation: "",
        location: { position: 0, uri: "" },
      });

      behaviorpack_structure_diagnose({ offset: 0, text: '"t/example"' }, diagnoser);
      behaviorpack_structure_diagnose({ offset: 0, text: '"t:example"' }, diagnoser);

      diagnoser.expectAmount(2)
    });
  });
});
