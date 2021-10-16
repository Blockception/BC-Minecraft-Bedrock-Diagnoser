import { minecraft_coordinate_diagnose } from "../../../../src/Lib/Diagnostics/Minecraft/Coordinate";
import { Types } from "bc-minecraft-bedrock-types";
import { TestDiagnoser } from "../../../diagnoser";

describe("Coordinate", () => {
  it("diagnose no errors", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_coordinate_diagnose(Types.OffsetWord.create("+16"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("-16"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("^16"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("~16"), B);

    minecraft_coordinate_diagnose(Types.OffsetWord.create("123"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("-1"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("^"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("~"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("^-16"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("~+54"), B);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();

    //Random words
    minecraft_coordinate_diagnose(Types.OffsetWord.create("&16"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("*4341"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("x"), B);
    minecraft_coordinate_diagnose(Types.OffsetWord.create("y"), B);

    B.expectAmount(4);
  });
});
