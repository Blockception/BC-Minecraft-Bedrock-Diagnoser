import { general_keyword_diagnose } from "../../../../src/Lib/Diagnostics/General/Keyword";
import { OffsetWord } from "../../../../src/Lib/Types/OffsetWord";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Keyword", () => {
  it("diagnose no errors", () => {
    const B = new TestDiagnoser();
    general_keyword_diagnose("playsound", OffsetWord.create("playsound"), B);
    general_keyword_diagnose("@a", OffsetWord.create("@a"), B);
    general_keyword_diagnose("invalid keyword but still expect to work", OffsetWord.create("invalid keyword but still expect to work"), B);

    B.expectEmpty();
  });

  it("diagnose with errors", () => {
    const B = new TestDiagnoser();
    general_keyword_diagnose("asd", OffsetWord.create("playsound"), B);
    general_keyword_diagnose("@s", OffsetWord.create("@a"), B);
    general_keyword_diagnose("invalid keyword but still expect to work", OffsetWord.create("I am different"), B);

    B.expectAmount(3);
  });
});
