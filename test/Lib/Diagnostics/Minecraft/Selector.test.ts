import { ParameterType } from 'bc-minecraft-bedrock-command';
import { minecraft_selector_diagnose } from '../../../../src/Lib/Diagnostics/Minecraft/Selector';
import { Types } from "bc-minecraft-bedrock-types";
import { TestDiagnoser } from "../../../diagnoser";

describe("Selector", () => {
  it("double negative types", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      Types.OffsetWord.create("@e[type=!player,type=!minecraft:sheep]"),
      B);

    B.expectEmpty();
  });

  it("all negative and one positive types", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      Types.OffsetWord.create("@e[type=!player,type=!minecraft:sheep,type=minecraft:zombie]"),
      B);

    B.expectEmpty();
  });

  it("double negative gamemode", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      Types.OffsetWord.create("@e[m=!1,m=!2]"),
      B);

    B.expectEmpty();
  });

  it("all negative and one positive gamemode", () => {
    const B = new TestDiagnoser();

    //Loop over all vanilla versions
    minecraft_selector_diagnose(
      {required:false,text:"",type:ParameterType.selector}, 
      Types.OffsetWord.create("@e[m=!1,m=!2,m=0]"),
      B);

    B.expectEmpty();
  });
});
