import { minecraft_check_command } from "../../../../src/Lib/Diagnostics/Minecraft/Commands";
import { OffsetWord } from "../../../../src/Lib/Types/OffsetWord";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Command", () => {
  it("diagnose no errors", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_check_command(OffsetWord.create("playsound"), B, false);
    minecraft_check_command(OffsetWord.create("tellraw"), B, false);
    minecraft_check_command(OffsetWord.create("dialogue"), B, false);
    minecraft_check_command(OffsetWord.create("event"), B, false);

    minecraft_check_command(OffsetWord.create("ability"), B, true);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();

    //Random words
    minecraft_check_command(OffsetWord.create("detect"), B, false);
    minecraft_check_command(OffsetWord.create("netherfortress"), B, false);

    B.expectAmount(2);
  });
});
