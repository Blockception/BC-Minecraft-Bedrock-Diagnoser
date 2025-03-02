import { Internal } from "bc-minecraft-bedrock-project";
import { getUsedComponents } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { Context } from "../../../utility/components";
import { Json } from "../../Json";
import { diagnose_molang } from "../../Molang/diagnostics";
import { behaviorpack_block_components_dependencies } from "./components/dependencies";
import { behaviorpack_diagnose_block_components } from "./components/diagnose";

/**Diagnoses the given document as an bp block
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Blocks", diagnoser);

  const block = Json.LoadReport<Internal.BehaviorPack.Block>(diagnoser);
  if (!Internal.BehaviorPack.Block.is(block)) return;

  const identifier = block['minecraft:block'].description.identifier
  diagnoser.context.getCache().behaviorPacks.blocks.forEach(block => {
    if (block.id === identifier && block.location.uri !== diagnoser.document.uri) diagnoser.add(
      `minecraft:block/description/identifier`,
      `Duplicate identifier "${identifier}" found.`,
      DiagnosticSeverity.warning,
      "behaviorpack.block.duplicate_id"
    );
  })

  //check components
  const context: Context<Internal.BehaviorPack.Block> = {
    source: block,
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

  if (block["minecraft:block"]["events"])
    diagnoser.add(
      `events`,
      `Block events have been deprecated in favour of \`minecraft:custom_components\`.`,
      DiagnosticSeverity.error,
      "behaviorpack.block.deprecated"
    );
}
