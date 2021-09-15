import { GeneralInfo } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/General/Types/GeneralInfo";
import { Location } from "bc-minecraft-bedrock-types/lib/src/Types/Location";
import { minecraft_tickingarea_diagnose } from "../../../../src/Lib/Diagnostics/Minecraft/Tickingarea";
import { OffsetWord } from "../../../../src/Lib/Types/OffsetWord";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Tickingarea", () => {
  it("diagnose no errors", () => {
    const data = TestDiagnoser.emptyContext().getCache();

    data.General.tickingAreas.set([
      GeneralInfo.create("main", Location.create(""), "main tickingarea"),
      GeneralInfo.create("calc", Location.create(""), "calculation area"),
      GeneralInfo.create("spawn", Location.create(""), "spawn location"),
      GeneralInfo.create("Spawn", Location.create(""), "spawn location"),
    ]);

    const B = TestDiagnoser.createFromProjectData(data);

    minecraft_tickingarea_diagnose(OffsetWord.create("main"), B);
    minecraft_tickingarea_diagnose(OffsetWord.create("calc"), B);
    minecraft_tickingarea_diagnose(OffsetWord.create("spawn"), B);
    minecraft_tickingarea_diagnose(OffsetWord.create("Spawn"), B);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();
    minecraft_tickingarea_diagnose(OffsetWord.create("main"), B);
    minecraft_tickingarea_diagnose(OffsetWord.create("calc"), B);
    minecraft_tickingarea_diagnose(OffsetWord.create("spawn"), B);
    minecraft_tickingarea_diagnose(OffsetWord.create("Spawn"), B);

    B.expectAmount(4);
  });
});
