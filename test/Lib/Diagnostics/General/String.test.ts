import { general_string_diagnose } from "../../../../src/Lib/Diagnostics/General/String";
import { Types } from "bc-minecraft-bedrock-types";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("String", () => {
  it("diagnose no errors", () => {
    const B = new TestDiagnoser();
    general_string_diagnose(Types.OffsetWord.create("data"), B);
    general_string_diagnose(Types.OffsetWord.create('"I am a valid minecraft string"'), B);
    general_string_diagnose(Types.OffsetWord.create("I_am_a_valid_minecraft_string"), B);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();
    general_string_diagnose(Types.OffsetWord.create('I am a invalid minecraft string"'), B);
    general_string_diagnose(Types.OffsetWord.create('"I am a invalid minecraft string'), B);
    general_string_diagnose(Types.OffsetWord.create("I am a invalid minecraft string"), B);

    B.expectAmount(3);
  });
});
