import { DiagnosticSeverity, DiagnosticsBuilder } from '../../../Types';


export function check_geo_and_rules(geoId: string, culling: string, diagnoser: DiagnosticsBuilder) {
  const projectData = diagnoser.context.getCache();
  const model = projectData.resourcePacks.models.get(geoId);
  if (!model) return;

  const cullingRule = projectData.resourcePacks.block_culling_rules.get(culling);
  if (!cullingRule) return;

  for (let i = 0; i < cullingRule.affected_bones.length; i++) {
    const bone = cullingRule.affected_bones[i];
    if (model.bones.includes(bone)) continue;

    diagnoser.add(
      culling,
      `The geometry '${geoId}' does not contain the bone '${bone}' as defined in the culling rule '${culling}'`,
      DiagnosticSeverity.warning,
      "resourcepack.block_culling.missing_bone"
    );
  }
}