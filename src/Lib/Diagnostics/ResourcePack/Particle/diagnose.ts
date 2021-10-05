import { MinecraftData } from 'bc-minecraft-bedrock-vanilla-data';
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../../main";
import { check_definition_value, education_enabled } from '../../Definitions';

export function resourcepack_particle_diagnose(id: string, diagnoser: DiagnosticsBuilder): void {
 //Defined in McProject
 if (check_definition_value(diagnoser.project.definitions.particle, id, diagnoser)) return;

 const data = diagnoser.context.getCache();

 //Project has entity
 if (data.hasEntity(id)) return;

 const edu = education_enabled(diagnoser);

 //Vanilla has entity
 if (MinecraftData.ResourcePack.hasParticle(id, edu)) return;

 //Nothing then report error
 diagnoser.Add(id, `Cannot find particle definition: ${id}`, DiagnosticSeverity.error, "resourcepack.particle.missing");
}
