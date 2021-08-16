import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { minecraft_effect_diagnose } from "../../../../src/Lib/Diagnostics/Minecraft/Effect";
import { OffsetWord } from "../../../../src/Lib/Types/OffsetWord";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Effect", () => {
  it("diagnose no errors", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    MinecraftData.General.Effects.forEach((effect) => minecraft_effect_diagnose(OffsetWord.create(effect), B));

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();

    //Random words
    minecraft_effect_diagnose(OffsetWord.create("main"), B);
    minecraft_effect_diagnose(OffsetWord.create("calc"), B);
    minecraft_effect_diagnose(OffsetWord.create("spawn"), B);
    minecraft_effect_diagnose(OffsetWord.create("Spawn"), B);

    B.expectAmount(4);
  });
});
