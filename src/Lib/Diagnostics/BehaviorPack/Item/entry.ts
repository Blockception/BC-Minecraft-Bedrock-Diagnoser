import { Internal } from "bc-minecraft-bedrock-project";
import { getUsedComponents } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { Context } from "../../../utility/components";
import { Json } from "../../Json";
import { behaviorpack_item_components_dependencies } from "./components/dependencies";
import { behaviorpack_diagnose_item_components } from "./components/diagnose";
import { no_other_duplicates } from "../../packs/duplicate-check";

/**Diagnoses the given document as an item
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  const item = Json.LoadReport<Internal.BehaviorPack.Item>(diagnoser);
  if (!Internal.BehaviorPack.Item.is(item)) return;

  const identifier = item["minecraft:item"].description.identifier;
  // check that no other exists with this id
  no_other_duplicates("behaviorpack.block", diagnoser.context.getCache().behaviorPacks.items, identifier, diagnoser);

  //Check components
  const context: Context<Internal.BehaviorPack.Item> = {
    source: item,
    components: getUsedComponents(item["minecraft:item"]),
  };

  behaviorpack_diagnose_item_components(item["minecraft:item"], context, diagnoser);

  behaviorpack_item_components_dependencies(item, context, diagnoser);

  if (item["minecraft:item"]["events"])
    diagnoser.add(
      `events`,
      `Item events have been deprecated in favour of \`minecraft:custom_components\`.`,
      DiagnosticSeverity.error,
      "behaviorpack.item.deprecated"
    );
}
