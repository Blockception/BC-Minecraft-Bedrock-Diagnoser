import { Minecraft, Types } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../../types";
import { check_definition_value, education_enabled } from "../../definitions";
import { behaviorpack_check_blockstates } from "../block-state/diagnose";

/**
 *
 * @param blockDescriptor
 * @param diagnoser
 */
export function behaviorpack_check_blockdescriptor(
  blockDescriptor: Types.OffsetWord,
  diagnoser: DiagnosticsBuilder
): void {
  behaviorpack_check_blockid_from_descriptor(blockDescriptor, diagnoser);
  behaviorpack_check_blockstates(blockDescriptor, diagnoser);
}

export function behaviorpack_check_blockid_from_descriptor(blockDescriptor: Types.OffsetWord, diagnoser: DiagnosticsBuilder) :boolean {
  return behaviorpack_check_blockid(Minecraft.Block.getId(blockDescriptor.text), diagnoser)
}

/**Checks if the blocks exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_check_blockid(id: string, diagnoser: DiagnosticsBuilder): boolean {

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.block, id, diagnoser)) return true;
  const data = diagnoser.context.getProjectData().projectData;

  //Project has block
  if (data.hasBlock(id)) return true;

  const edu = education_enabled(diagnoser);

  //Vanilla has block
  if (MinecraftData.BehaviorPack.hasBlock(id, edu)) return true;

  //Missing namespace?
  if (!id.includes(":")) {
    //retry
    id = "minecraft:" + id;

    //Defined in McProject
    if (check_definition_value(diagnoser.project.definitions.block, id, diagnoser)) return true;

    //Project has block
    if (data.hasBlock(id)) return true;
  }

  //Vanilla has block
  if (MinecraftData.BehaviorPack.hasBlock(id, edu)) return true;

  //Nothing then report error
  diagnoser.add(id, `Cannot find block definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.block.missing");
  return false;
}
