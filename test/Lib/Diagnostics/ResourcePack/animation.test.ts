import { TextDocument } from 'bc-minecraft-bedrock-project/lib/src/types';
import { ResourcePack } from "../../../../src/Lib/Diagnostics/ResourcePack/ResourcePack";
import { TestDiagnoser } from "../../../diagnoser";

describe("ResourcePack", () => {
  describe("Animation", () => {
    it("returns errors for the times outside of the animation_length", () => {
      // One time is outside of the animation_length
      // One time is inside of the animation_length

      const doc: TextDocument = {
        uri: "c:\\test-rp\\animations\\test.animation.json",
        getText: () => `{
          "format_version": "1.8.0",
          "animations": {
            "animation.agent.shrug": {
              "animation_length": 1.25,
              "bones": {
                "head": {
                  "rotation": {
                    "0.3333": [ 0, 0, 0 ],
                    "1.5": [ 0, 0, 0 ]
                  }
                }
              }
            }
          }
        }`,
      };

      const diagnoser = TestDiagnoser.createDocument(undefined, doc);

      ResourcePack.Process(diagnoser);

      diagnoser.expectAmount(2);
      const item = diagnoser.getSeverity(3);

      expect(item).toBeDefined();
      if (item === undefined) return;

      expect(item.message).toEqual("Time value of bone 1.5 is greater than the animation length: 1.25");
      expect(item.position).toEqual("animation.agent.shrug/head/1.5");
    });
  });
});
