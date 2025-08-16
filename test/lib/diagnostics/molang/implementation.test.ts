import { Molang } from "bc-minecraft-molang";
import { diagnose_molang_implementation } from "../../../../src/lib/diagnostics/molang/diagnostics";
import { TestDiagnoser } from "../../../diagnoser";

describe("Molang", () => {
  describe("diagnose_molang_implementation", () => {
    it("no errors", () => {
      const diagnoser = TestDiagnoser.create();

      const using = new Molang.MolangSet();
      const owner = new Molang.MolangSet();

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

      const using = new Molang.MolangSet();
      const owner = new Molang.MolangSet();

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

      const using = new Molang.MolangSet();
      const owner = new Molang.MolangSet();

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
