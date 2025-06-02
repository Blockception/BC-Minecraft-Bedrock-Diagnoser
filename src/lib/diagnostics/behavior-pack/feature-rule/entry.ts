import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json";
import { no_other_duplicates } from "../../packs/duplicate-check";
import { behaviorpack_feature_diagnose } from '../feature/diagnose';

/**Diagnoses the given document as an item
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  const featureRule = Json.LoadReport<Internal.BehaviorPack.FeatureRule>(diagnoser);
  if (!Internal.BehaviorPack.FeatureRule.is(featureRule)) return;

  const identifier = featureRule['minecraft:feature_rules'].description.identifier;

  const path = diagnoser.document.uri.split("/");
  if (
    !identifier.endsWith(
      path
        .slice(path.findIndex((v) => v == "feature_rules") + 1)
        .join("/")
        .replace(".json", "")
    )
  )
    diagnoser.add(
      identifier,
      `Feature identifier must match the relative path to the components up to and including the file name`,
      DiagnosticSeverity.error,
      "behaviorpack.feature_rule.identifier"
    );

  // check that no other exists with this id
  no_other_duplicates(
    "behaviorpack.components",
    diagnoser.context.getCache().behaviorPacks.features_rules,
    identifier,
    diagnoser
  );

  behaviorpack_feature_diagnose(featureRule['minecraft:feature_rules'].description.places_feature, diagnoser)

  //TODO: Check if feature type is cave carver when using pregeneration pass

  //TODO: Check filters after setting up biomes
  
}