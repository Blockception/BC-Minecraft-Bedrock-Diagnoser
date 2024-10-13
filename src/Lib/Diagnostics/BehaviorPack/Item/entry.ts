import { DocumentDiagnosticsBuilder, DiagnosticSeverity } from "../../../Types";
import { diagnose_molang } from "../../Molang/diagnostics";
import { Json } from "../../Json";
import { Internal } from "bc-minecraft-bedrock-project";
import { Context } from "../../../utility/components";
import { getUsedComponents } from "bc-minecraft-bedrock-types/lib/minecraft/components";
import { behaviorpack_item_components_dependencies } from "./components/dependencies";
import { behaviorpack_diagnose_item_components } from "./components/diagnose";

/**Diagnoses the given document as an item
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {

  const item = Json.LoadReport<Internal.BehaviorPack.Item>(diagnoser);
  if (!Internal.BehaviorPack.Item.is(item)) return;

  //Check components
  const context: Context = {
    components: getUsedComponents(item["minecraft:item"]),
  };

  behaviorpack_diagnose_item_components(item["minecraft:item"], context, diagnoser);

  behaviorpack_item_components_dependencies(item, context, diagnoser);

  if (item["minecraft:item"]["events"]) diagnoser.add(
    `events`,
    `Item events have been deprecated in favour of \`minecraft:custom_components\`.`,
    DiagnosticSeverity.error,
    "behaviorpack.item.deprecated"
  );
}
