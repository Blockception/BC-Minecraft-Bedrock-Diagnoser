import { Location } from "bc-minecraft-bedrock-types/lib/src/types";
import { Types } from "bc-minecraft-bedrock-types";
import { TestDiagnoser } from "../../../diagnoser";
import { GeneralInfo } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/General/Types/GeneralInfo";
import { minecraft_objectives_diagnose } from '../../../../src/Lib/Diagnostics/Minecraft/Objective';

describe("Objective", () => {
  it("diagnose no errors", () => {
    const B = new TestDiagnoser();

    const objectivesData = B.context.getCache().general.objectives;

    const objectives: string[] = ["test", "test.example", "Test_Example", "Test-Example"];

    objectives.forEach((o) => objectivesData.set(GeneralInfo.create(o, Location.create(""))));
    objectives.forEach((o) => minecraft_objectives_diagnose(Types.OffsetWord.create(o), B));

    B.expectAmount(0);
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();

    const objectivesData = B.context.getCache().general.objectives;

    const objectives: string[] = ["te/st", "test!example", "Test@Example", "Test#Example"];

    objectives.forEach((o) => objectivesData.set(GeneralInfo.create(o, Location.create(""))));
    objectives.forEach((o) => minecraft_objectives_diagnose(Types.OffsetWord.create(o), B));

    B.expectAmount(4);
  });  

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();

    const objectives: string[] = ["test", "test.example", "Test_Example", "Test-Example"];
    objectives.forEach((o) => minecraft_objectives_diagnose(Types.OffsetWord.create(o), B));

    B.expectAmount(4);
  });
});
