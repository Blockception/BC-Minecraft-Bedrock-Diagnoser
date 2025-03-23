import { Internal } from 'bc-minecraft-bedrock-project';
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { Json } from '../../Json';
import { diagnose_molang } from '../../Molang/diagnostics';
import { MinecraftData } from 'bc-minecraft-bedrock-vanilla-data';
import { education_enabled } from '../../Definitions';
import { texture_files_diagnose } from '../Texture Atlas';

/**Diagnoses the given document as a particle
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Particles", diagnoser);

  const particle = Json.LoadReport<Internal.ResourcePack.Particle>(diagnoser);
  if (!Internal.ResourcePack.Particle.is(particle)) return;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const texture = particle.particle_effect?.description?.['basic_render_parameters']?.['texture'];

  if (typeof texture != 'string') return;

  const pack = diagnoser.context.getCache().resourcePacks.get(diagnoser.document.uri);
  if (pack === undefined) return;

    if (MinecraftData.ResourcePack.hasTexture(texture, education_enabled(diagnoser))) return;

  const rp_files = diagnoser.context
    .getFiles(pack.folder, ["**/textures/**/*.{tga,png,jpg,jpeg}"], pack.context.ignores)
    .map((item) => item.replace(/\\/gi, "/"));

  texture_files_diagnose('texture', texture, rp_files, diagnoser)
  
}
