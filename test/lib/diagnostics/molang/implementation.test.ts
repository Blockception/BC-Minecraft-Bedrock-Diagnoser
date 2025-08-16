import { Molang } from "bc-minecraft-molang";
import { diagnose_molang_implementation, MolangMetadata } from "../../../../src/lib/diagnostics/molang/diagnostics";
import { Metadata } from "../../../../src/lib/types";
import { TestDiagnoser } from "../../../diagnoser";

describe("Molang", () => {
  describe("diagnose_molang_implementation", () => {
    it("no errors", () => {
      const diagnoser = Metadata.withMetadata(TestDiagnoser.create(), { userType: "Entities" } as MolangMetadata);

      const using = new Molang.MolangSet();
      const owner = new Molang.MolangSet();

      diagnose_molang_implementation(
        { id: "animation.example.walk", molang: using },
        { id: "minecraft:sheep", molang: owner },
        diagnoser
      );

      diagnoser.expectEmpty();
    });

    it("1 error", () => {
      const diagnoser = Metadata.withMetadata(TestDiagnoser.create(), { userType: "Entities" } as MolangMetadata);

      const using = new Molang.MolangSet();
      const owner = new Molang.MolangSet();

      diagnose_molang_implementation(
        { id: "animation.example.walk", molang: using },
        { id: "minecraft:sheep", molang: owner },
        diagnoser
      );

      diagnoser.expectAmount(1);
    });

    it("1 error", () => {
      const diagnoser = Metadata.withMetadata(TestDiagnoser.create(), { userType: "Entities" } as MolangMetadata);

      const using = new Molang.MolangSet();
      const owner = new Molang.MolangSet();

      diagnose_molang_implementation(
        { id: "animation.example.walk", molang: using },
        { id: "minecraft:sheep", molang: owner },
        diagnoser
      );

      diagnoser.expectAmount(1);
    });
  });
});
