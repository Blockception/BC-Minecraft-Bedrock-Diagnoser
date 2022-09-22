import { ParameterInfo, ParameterType } from "bc-minecraft-bedrock-command";
import { minecraft_selector_diagnose } from "../../../../src/Lib/Diagnostics/Minecraft/Selector";
import { Types } from "bc-minecraft-bedrock-types";
import { TestDiagnoser } from "../../../diagnoser";
import { TestProjecData } from "../../../testprojectdata.test";
import { GeneralInfo } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/General/Types";
import { Location } from "bc-minecraft-bedrock-types/lib/src/Types";

describe("Selector", () => {
  const context = TestProjecData.CreateContext();
  const pi: ParameterInfo = { required: false, text: "", type: ParameterType.selector };
  const cache = context.getCache()
  cache.General.objectives.set(GeneralInfo.create("data", Location.create("test"), "test objective"));
  cache.General.tags.set(GeneralInfo.create("foo", Location.create("test"), "test tag"));

  it("Double negative types should not return errors", () => {
    const B = new TestDiagnoser(context);

    //Loop over all vanilla versions
    minecraft_selector_diagnose(pi, Types.OffsetWord.create("@e[type=!player,type=!minecraft:sheep]"), B);

    B.expectEmpty();
  });

  it("All negative and one positive types", () => {
    const B = new TestDiagnoser(context);

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      pi,
      Types.OffsetWord.create("@e[type=!player,type=!minecraft:sheep,type=minecraft:zombie]"),
      B
    );

    B.expectEmpty();
  });

  it("Double negative gamemode", () => {
    const B = new TestDiagnoser(context);

    //Loop over all vanilla versions
    minecraft_selector_diagnose(pi, Types.OffsetWord.create("@e[m=!1,m=!2]"), B);

    B.expectEmpty();
  });

  it("All negative and one positive gamemode", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(pi, Types.OffsetWord.create("@e[m=!1,m=!2,m=0]"), B);

    B.expectEmpty();
  });

  describe("Expecting no errors", () => {
    const valid = [
      "@e[type=!player,type=!minecraft:sheep]",
      "@a[type=player,type=!minecraft:sheep,type=!minecraft:sheep]",
      "@s",
      "@e[type=minecraft:sheep,r=2]",
      "@p[ry=180,rym=135]",
      "@s[y=15,dy=-100,z=~,x=~]",
      "@s[scores={data=..3,data=5..}]",
      "@e[name=\"main\",tag=foo]",
      "@e[x=0,y=2,z=3,dx=4,dy=5,dz=6,type=minecraft:sheep,c=1]"
    ];

    valid.forEach((test) => {
      it(test, () => {
        const B = new TestDiagnoser(context);

        //Loop over all vanilla versions
        minecraft_selector_diagnose(pi, Types.OffsetWord.create(test), B);

        B.expectEmpty();
      });
    });
  });

  describe("Expecting errors", () => {
    const invalid = [
      "@e[type=player,type=minecraft:sheep]", 
      "@a[scores={data=1},scores={data=2}]",
      "@a[scores={data={value=1}}",
      "@a[scores={data=[value=1]}",
      "@r[hasitem={item=minecraft:stone,data=1},hasitem=[{item=minecraft:stone,data=2}]]",
      "@r[hasitem=[item=minecraft:stone]]",
    ];

    invalid.forEach((test) => {
      it(test, () => {
        const B = new TestDiagnoser(context);

        //Loop over all vanilla versions
        minecraft_selector_diagnose(pi, Types.OffsetWord.create(test), B);

        B.expectAny();
      });
    });
  });
});
