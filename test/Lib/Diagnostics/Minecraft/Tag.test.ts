import { ProjectData } from "bc-minecraft-bedrock-project";
import { GeneralInfo } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/General/Types/GeneralInfo";
import { Location } from "bc-minecraft-bedrock-types/lib/src/Types/Location";
import { minecraft_tag_diagnose } from "../../../../src/Lib/Diagnostics/Minecraft/Tag";
import { OffsetWord } from "../../../../src/Lib/Types/OffsetWord";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Tag", () => {
  it("diagnose no errors", () => {
    const data = new ProjectData();

    data.General.tags.set([
      GeneralInfo.create("init", Location.create(""), "main tickingarea"),
      GeneralInfo.create("Flying", Location.create(""), "main tickingarea"),
      GeneralInfo.create("Follow", Location.create(""), "main tickingarea"),
      GeneralInfo.create("Attack", Location.create(""), "main tickingarea"),
    ]);

    const B = TestDiagnoser.createFromProjectData(data);

    minecraft_tag_diagnose(OffsetWord.create("init"), B);
    minecraft_tag_diagnose(OffsetWord.create("Flying"), B);
    minecraft_tag_diagnose(OffsetWord.create("Follow"), B);
    minecraft_tag_diagnose(OffsetWord.create("Attack"), B);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();
    minecraft_tag_diagnose(OffsetWord.create("main"), B);
    minecraft_tag_diagnose(OffsetWord.create("calc"), B);
    minecraft_tag_diagnose(OffsetWord.create("spawn"), B);
    minecraft_tag_diagnose(OffsetWord.create("Spawn"), B);

    B.expectAmount(4);
  });
});
