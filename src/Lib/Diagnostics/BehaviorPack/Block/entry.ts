import { behaviorpack_diagnose_block_components } from "./components/diagnose";
import { diagnose_molang } from "../../Molang/diagnostics";
import { DocumentDiagnosticsBuilder } from "../../../Types";
import { Internal } from "bc-minecraft-bedrock-project";
import { getUsedComponents } from "bc-minecraft-bedrock-types/lib/src/Minecraft/Components";
import { Json } from "../../Json";
import { Context } from "../../../Utility/components";
import { behaviorpack_block_components_dependencies } from "./components/dependencies";

/**Diagnoses the given document as an bp block
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Blocks", diagnoser);

  const block = Json.LoadReport<Internal.BehaviorPack.Block>(diagnoser);
  if (!Internal.BehaviorPack.Block.is(block)) return;

  //check components
  const context: Context = {
    components: getUsedComponents(block["minecraft:block"]),
  };
  block["minecraft:block"]?.permutations?.forEach((p) => {
    context.components.push(...getUsedComponents(p));
  });

  behaviorpack_diagnose_block_components(block["minecraft:block"], context, diagnoser);

  block["minecraft:block"]?.permutations?.forEach((p) => {
    behaviorpack_diagnose_block_components(p, context, diagnoser);
  });

  behaviorpack_block_components_dependencies(block, context, diagnoser);
}
