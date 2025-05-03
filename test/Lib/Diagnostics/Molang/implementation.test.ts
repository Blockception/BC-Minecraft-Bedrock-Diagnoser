import { Molang } from "bc-minecraft-molang";
import { diagnose_molang_implementation } from "../../../../src/lib/diagnostics/molang/diagnostics";
import { TestDiagnoser } from "../../../diagnoser";

describe("Molang", () => {
  describe("diagnose_molang_implementation", () => {
    it("no errors", () => {
      const diagnoser = TestDiagnoser.create();

      const using = Molang.MolangFullSet.create();
      const owner = Molang.MolangFullSet.create();

      using.queries.using.push("is_jumping");
      using.temps.using.push("foo");
      using.variables.using.push("spleef", "state");
      using.variables.defined.push("state");

      owner.temps.defined.push("foo");
      owner.variables.defined.push("spleef");

      diagnose_molang_implementation(
        { id: "animation.example.walk", molang: using },
        { id: "minecraft:sheep", molang: owner },
        "Entities",
        diagnoser
      );

      diagnoser.expectEmpty();
    });

    it("1 error", () => {
      const diagnoser = TestDiagnoser.create();

      const using = Molang.MolangFullSet.create();
      const owner = Molang.MolangFullSet.create();

      using.queries.using.push("is_jumping");
      using.temps.using.push("foo");
      using.variables.using.push("spleef", "state");
      using.variables.defined.push("state");

      owner.variables.defined.push("spleef");

      diagnose_molang_implementation(
        { id: "animation.example.walk", molang: using },
        { id: "minecraft:sheep", molang: owner },
        "Entities",
        diagnoser
      );

      diagnoser.expectAmount(1);
    });

    it("1 error", () => {
      const diagnoser = TestDiagnoser.create();

      const using = Molang.MolangFullSet.create();
      const owner = Molang.MolangFullSet.create();

      using.queries.using.push("is_jumping");
      using.temps.using.push("foo");
      using.variables.using.push("spleef", "state");
      using.variables.defined.push("state");

      owner.temps.defined.push("foo");

      diagnose_molang_implementation(
        { id: "animation.example.walk", molang: using },
        { id: "minecraft:sheep", molang: owner },
        "Entities",
        diagnoser
      );

      diagnoser.expectAmount(1);
    });
  });
});
