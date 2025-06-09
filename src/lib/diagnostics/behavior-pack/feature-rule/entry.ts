import { Internal } from "bc-minecraft-bedrock-project";
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from "../../json";
import { no_other_duplicates } from "../../packs/duplicate-check";
import { behaviorpack_feature_diagnose } from '../feature/diagnose';

/**Diagnoses the given document as an feature rule
 * @param diagnoser The diagnoser builder to receive the errors*/
export function diagnose_feature_rules_document(diagnoser: DocumentDiagnosticsBuilder): void {
  const featureRule = Json.LoadReport<Internal.BehaviorPack.FeatureRule>(diagnoser);
  if (!Internal.BehaviorPack.FeatureRule.is(featureRule)) return;

  const identifier = featureRule['minecraft:feature_rules'].description.identifier;

  // check that no other exists with this id
  no_other_duplicates(
    "behaviorpack.components",
    diagnoser.context.getProjectData().projectData.behaviorPacks.features_rules,
    identifier,
    diagnoser
  );

  behaviorpack_feature_diagnose(featureRule['minecraft:feature_rules'].description.places_feature, diagnoser)

  //TODO: Check if feature type is cave carver when using pregeneration pass

  //TODO: Check filters after setting up biomes
  
}