import { Internal } from "bc-minecraft-bedrock-project";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { Json } from "../../Json";
import { no_other_duplicates } from "../../packs/duplicate-check";
import { behaviorpack_feature_diagnose } from './diagnose';
import { behaviorpack_check_blockid } from '../Block';
import { behaviorpack_structure_diagnose } from '../Structure';

/**Diagnoses the given document as an item
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  const feature = Json.LoadReport<Internal.BehaviorPack.Feature>(diagnoser);
  if (!Internal.BehaviorPack.Feature.is(feature)) return;

  const identifier = findFeatureIdentifier(feature)
  if (!identifier) return;

  const path = diagnoser.document.uri.split('/')
  if (!identifier.endsWith(path.slice(path.findIndex(v => v == 'features') + 1).join('/').replace('.json', ''))) diagnoser.add(identifier, `Feature identifier must match the relative path to the feature up to and including the file name`, DiagnosticSeverity.error, "behaviorpack.feature.identifier");
  
  // check that no other exists with this id
  no_other_duplicates("behaviorpack.feature", diagnoser.context.getCache().behaviorPacks.features, identifier, diagnoser);

  //@ts-ignore
  if (feature['minecraft:aggregate_feature']) feature['minecraft:aggregate_feature'].features?.forEach(id => {
    behaviorpack_feature_diagnose(id, diagnoser)
  });

  //@ts-ignore
  if (feature['minecraft:cave_carver_feature']) diagnose_block_reference(feature['minecraft:cave_carver_feature'].fill_with, diagnoser)

  //@ts-ignore
  if (feature['minecraft:fossil_feature']) diagnose_block_reference(feature['minecraft:fossil_feature'].ore_block, diagnoser)

  if (feature['minecraft:geode_feature']) {
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].filler, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].inner_layer, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].alternate_inner_layer, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].middle_layer, diagnoser)
    //@ts-ignore
    feature['minecraft:geode_feature'].inner_placements?.forEach(id => {
      diagnose_block_reference(id, diagnoser)
    });
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].alternate_inner_layer, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].alternate_inner_layer, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].alternate_inner_layer, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].alternate_inner_layer, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:geode_feature'].alternate_inner_layer, diagnoser)
  }

  if (feature['minecraft:growing_plant_feature']) {
    //@ts-ignore
    feature['minecraft:growing_plant_feature'].body_blocks?.forEach(id => {
      diagnose_block_reference(id, diagnoser)
    });
    //@ts-ignore
    feature['minecraft:growing_plant_feature'].head_blocks?.forEach(id => {
      diagnose_block_reference(id, diagnoser)
    });
  }

  if (feature['minecraft:multiface_feature']) {
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:multiface_feature'].places_block, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:multiface_feature'].can_place_on, diagnoser)
  }

  //@ts-ignore
  if (feature['minecraft:nether_cave_carver_feature']) diagnose_block_reference(feature['minecraft:nether_cave_carver_feature'].fill_with, diagnoser)

  //@ts-ignore
  if (feature['minecraft:ore_feature']) feature['minecraft:ore_feature'].replace_rules?.forEach(entry => {
    diagnose_block_reference(entry.places_block, diagnoser)
    entry.may_replace?.forEach((ref: any) => {
      diagnose_block_reference(ref, diagnoser)
    });
  });

  //@ts-ignore
  if (feature['minecraft:partially_exposed_blob_feature']) diagnose_block_reference(feature['minecraft:partially_exposed_blob_feature'].places_block, diagnoser)

  //@ts-ignore
  if (feature['minecraft:scatter_feature']) behaviorpack_feature_diagnose(feature['minecraft:scatter_feature'].places_feature, diagnoser)

  //@ts-ignore
  if (feature['minecraft:search_feature']) behaviorpack_feature_diagnose(feature['minecraft:search_feature'].places_feature, diagnoser)

  //@ts-ignore
  if (feature['minecraft:search_feature']) feature['minecraft:search_feature'].features?.forEach(id => {
    behaviorpack_feature_diagnose(id, diagnoser)
  });

  if (feature['minecraft:single_block_feature']) {
    //@ts-ignore
    if (Array.isArray(feature['minecraft:single_block_feature'].places_block)) feature['minecraft:single_block_feature'].places_block?.forEach(entry => {
      diagnose_block_reference(entry, diagnoser)
    });
    //@ts-ignore
    else diagnose_block_reference(feature['minecraft:single_block_feature'].places_block, diagnoser)
  }

  //@ts-ignore
  if (feature['minecraft:snap_to_surface_feature']) behaviorpack_feature_diagnose(feature['minecraft:snap_to_surface_feature'].feature_to_snap, diagnoser)

  if (feature['minecraft:structure_template_feature']) {
    //@ts-ignore
    if (typeof feature['minecraft:structure_template_feature'].structure_name == 'string') behaviorpack_structure_diagnose('"' + feature['minecraft:structure_template_feature'].structure_name + '"', diagnoser)
    //@ts-ignore
    feature['minecraft:structure_template_feature'].constraints?.block_intersection?.block_allowlist?.forEach(id => {
      diagnose_block_reference(id, diagnoser)
    });
    //@ts-ignore
    feature['minecraft:structure_template_feature'].constraints?.block_intersection?.block_whitelist?.forEach(id => {
      diagnose_block_reference(id, diagnoser)
    });
  }

  //@ts-ignore
  if (feature['minecraft:surface_relative_threshold_feature']) behaviorpack_feature_diagnose(feature['minecraft:surface_relative_threshold_feature'].feature_to_place, diagnoser)

  //TODO Tree feature

  if (feature['minecraft:underwater_cave_carver_feature']) {
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:underwater_cave_carver_feature'].fill_with, diagnoser)
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:underwater_cave_carver_feature'].replace_air_with, diagnoser)
  }

  if (feature['minecraft:vegetation_patch_feature']) {
    //@ts-ignore
    feature['minecraft:vegetation_patch_feature'].replaceable_blocks?.forEach(id => {
      diagnose_block_reference(id, diagnoser)
    });
    //@ts-ignore
    diagnose_block_reference(feature['minecraft:vegetation_patch_feature'].ground_block, diagnoser)
    //@ts-ignore
    behaviorpack_feature_diagnose(feature['minecraft:vegetation_patch_feature'].vegetation_feature, diagnoser)
  }

  if (feature['minecraft:weighted_random_feature']) {
    //@ts-ignore
    feature['minecraft:weighted_random_feature'].features?.forEach(entry => {
      behaviorpack_feature_diagnose(entry[0], diagnoser)
    });
  }

}

function findFeatureIdentifier(source: Internal.BehaviorPack.Feature): string | undefined {
  for (const key in source) {
    if (key != 'format_version') return (source as any)[key]?.description?.identifier
  }
  return undefined;
}

function diagnose_block_reference(reference: string | any, diagnoser: DocumentDiagnosticsBuilder) {

  if (typeof reference == 'string') behaviorpack_check_blockid(reference, diagnoser)
  else if (typeof reference.name == 'string') behaviorpack_check_blockid(reference.name, diagnoser)

}