import { ParameterType } from 'bc-minecraft-bedrock-command';
import { minecraft_selector_diagnose } from '../../../../src/Lib/Diagnostics/Minecraft/Selector';
import { OffsetWord } from "../../../../src/Lib/Types/OffsetWord";
import { TestDiagnoser } from "../../../diagnoser.test";

describe("Selector", () => {
  it("double negative types", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      OffsetWord.create("@e[type=!player,type=!minecraft:sheep]"),
      B);

    B.expectEmpty();
  });

  it("all negative and one positive types", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      OffsetWord.create("@e[type=!player,type=!minecraft:sheep,type=minecraft:zombie]"),
      B);

    B.expectEmpty();
  });

  it("double negative gamemode", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      OffsetWord.create("@e[m=!1,m=!2]"),
      B);

    B.expectEmpty();
  });

  it("all negative and one positive gamemode", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      OffsetWord.create("@e[m=!1,m=!2,m=0]"),
      B);

    B.expectEmpty();
  });
});
