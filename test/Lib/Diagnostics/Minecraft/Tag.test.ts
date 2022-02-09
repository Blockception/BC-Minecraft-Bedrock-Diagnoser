import { GeneralInfo } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/General/Types/GeneralInfo";
import { Location } from "bc-minecraft-bedrock-types/lib/src/Types/Location";
import { minecraft_tag_diagnose } from "../../../../src/Lib/Diagnostics/Minecraft/Tag";
import { Types } from "bc-minecraft-bedrock-types";
import { TestDiagnoser } from "../../../diagnoser";

describe("Tag", () => {
  it("diagnose no errors", () => {
    const B = TestDiagnoser.Create();
    const data = B.context.getCache();

    data.General.tags.set([
      GeneralInfo.create("init", Location.create(""), "main tickingarea"),
      GeneralInfo.create("Flying", Location.create(""), "main tickingarea"),
      GeneralInfo.create("Follow", Location.create(""), "main tickingarea"),
      GeneralInfo.create("Attack", Location.create(""), "main tickingarea"),
    ]);

    minecraft_tag_diagnose(Types.OffsetWord.create("init"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create("Flying"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create("Follow"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create("Attack"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create(""), B);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();
    minecraft_tag_diagnose(Types.OffsetWord.create("main"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create("calc"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create("spawn"), B);
    minecraft_tag_diagnose(Types.OffsetWord.create("Spawn"), B);

    B.expectAmount(4);
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();

    const objectivesData = B.context.getCache().General.tags;
    const tags: string[] = ["te/st", "test!example", "Test@Example", "Test#Example"];
    
    tags.forEach((t) => objectivesData.set(GeneralInfo.create(t, Location.create(""))));
    tags.forEach((t) => minecraft_tag_diagnose(Types.OffsetWord.create(t), B));

    B.expectAmount(4);
  }); 
});
