import { TextDocument } from "bc-minecraft-bedrock-project/lib/src/Lib/Types/TextDocument";
import { expect } from "chai";
import { ResourcePack } from "../../../../src/Lib/Diagnostics/ResourcePack/ResourcePack";
import { TestDiagnoser } from "../../../diagnoser";

describe("ResourcePack", () => {
  describe("TextureAtlas", () => {
    it("no errors", () => {
      const doc: TextDocument = {
        uri: "c:\\test.json",
        getText: () => `{
          "num_mip_levels" : 4,
          "padding" : 8,
          "resource_pack_name" : "vanilla",
          "texture_name" : "atlas.terrain",
          "texture_data" : {
            "andesite" : {
              "textures" : "textures/blocks/stone_andesite"
            },
            "anvil_base" : {
              "textures" : [
                "textures/blocks/stone_andesite",
                "textures/blocks/anvil_base",
                "textures/blocks/stone_andesite",
                "textures/blocks/anvil_base"
              ]
            },
            "grass_carried" : {
              "textures" : {
                "overlay_color" : "#79c05a",
                "path" : "textures/blocks/grass_side"
              }
            },
            "grass_carried_bottom" : {
              "textures": {
                "variations": [
                  { "path": "textures/air/stone_andesite" },
                  { "path": "textures/air/anvil_base" },
                ]
              }
            },
          }
        }`,
      };

      const diagnoser = TestDiagnoser.Create();
      diagnoser.context.getFiles = () => {
        return ["textures/blocks/stone_andesite", "textures/blocks/anvil_base", "textures/blocks/grass_side"];
      };

      try {
        const value = ResourcePack.Process(doc, diagnoser);
      } catch (err: any) {
        if (typeof err.message !== "undefined") expect.fail("Expect no errors: " + err.message);
      }
    });
  });
});
