import { Internal } from "bc-minecraft-bedrock-project";
import { getUsedComponents } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { Context } from "../../../utility/components";
import { Json } from "../../Json";
import { diagnose_molang } from "../../Molang/diagnostics";
import { behaviorpack_block_components_dependencies } from "./components/dependencies";
import { behaviorpack_diagnose_block_components } from "./components/diagnose";
import { no_other_duplicates } from "../../packs/duplicate-check";
import { FormatVersion } from 'bc-minecraft-bedrock-types/lib/minecraft';

/**Diagnoses the given document as an bp block
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Blocks", diagnoser);

  const block = Json.LoadReport<Internal.BehaviorPack.Block>(diagnoser);
  if (!Internal.BehaviorPack.Block.is(block)) return;

  const identifier = block["minecraft:block"].description.identifier;
  // check that no other exists with this id
  no_other_duplicates("behaviorpack.block", diagnoser.context.getCache().behaviorPacks.blocks, identifier, diagnoser);

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

  const group = (block['minecraft:block'].description as any).menu_category?.group
  if (typeof group != 'string') return;

  try {
    const version = FormatVersion.parse(context.source.format_version);
    const greaterThan12150 = version[0] > 1 || (version[0] === 1 && version[1] > 21) || (version[0] === 1 && version[1] === 21 && version[2] > 50)
    if (greaterThan12150 && group.startsWith('itemGroup')) diagnoser.add(group,
      `Item groups must be namespaced in versions > 1.21.50`,
      DiagnosticSeverity.error,
      'behaviorpack.block.namespace_group')
    if (!greaterThan12150 && group.includes(':')) diagnoser.add(group,
        `Item groups cannot be namespaced in versions <= 1.21.50`,
        DiagnosticSeverity.error,
        'behaviorpack.block.namespace_group')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // Leaving this empty as the base diagnoser should already flag an invalid format version
  }

}
