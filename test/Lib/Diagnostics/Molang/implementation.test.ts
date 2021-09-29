import { MolangFullSet } from "bc-minecraft-molang";
import { diagnose_molang_implementation } from "../../../../src/Lib/Diagnostics/Molang/diagnostics";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Molang", () => {
  describe("diagnose_molang_implementation", () => {
    it("no errors", () => {
      const diganoser = TestDiagnoser.Create();

      const using = MolangFullSet.create();
      const owner = MolangFullSet.create();

      using.queries.using.push("is_jumping")
      using.temps.using.push("foo");
      using.variables.using.push("spleef", "state");
      using.variables.defined.push("state")

      owner.temps.defined.push("push");
      owner.variables.defined.push("spleef");

      diagnose_molang_implementation({ id: "animation.example.walk", molang: using }, { id: "minecraft:sheep", molang: owner }, "entity", diganoser);

      diganoser.expectEmpty();
    });
  });
});
