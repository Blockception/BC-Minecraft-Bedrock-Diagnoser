import { Types } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../main";
import { check_definition_value, education_enabled } from "../../Definitions";

export function resourcepack_particle_diagnose(id: string | Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const particle_id = typeof id === "string" ? id : id.text;

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.particle, particle_id, diagnoser)) return;

  const data = diagnoser.context.getCache();

  //Project has entity
  if (data.ResourcePacks.particles.has(particle_id)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has entity
  if (MinecraftData.ResourcePack.hasParticle(particle_id, edu)) return;

  //Nothing then report error
  diagnoser.add(
    "particle/" + id,
    `Cannot find particle definition: ${particle_id}`,
    DiagnosticSeverity.error,
    "resourcepack.particle.missing"
  );
}
