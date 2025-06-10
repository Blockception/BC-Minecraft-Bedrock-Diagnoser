import { Internal } from 'bc-minecraft-bedrock-project';
import { DocumentDiagnosticsBuilder } from "../../../types";
import { Json } from '../../json';
import { getUsedComponents } from 'bc-minecraft-bedrock-types/lib/minecraft/components';
import { Context } from '../../../utility/components';
import { resourcepack_diagnose_biome_components } from './components';

/**Diagnoses the given document as a biome_client file
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function diagnose_biomes_client_document(diagnoser: DocumentDiagnosticsBuilder): void {
   const biome = Json.LoadReport<Internal.ResourcePack.Biome>(diagnoser);
  if (!Internal.ResourcePack.Biome.is(biome)) return;

  //TODO: Check if biome.description.identifier is valid

  const context: Context<Internal.ResourcePack.Biome> = {
    source: biome,
    components: getUsedComponents(biome['minecraft:client_biome'].components),
  }

  resourcepack_diagnose_biome_components(biome['minecraft:client_biome'], context, diagnoser);

}