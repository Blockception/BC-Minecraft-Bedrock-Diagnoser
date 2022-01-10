import { Minecraft } from "bc-minecraft-bedrock-types";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { BehaviorPack } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { DiagnosticSeverity } from "../../../Types/DiagnosticsBuilder/Severity";
import { check_definition_value, education_enabled } from "../../Definitions";
import { Types} from 'bc-minecraft-bedrock-types';

/**
 *
 * @param blockDescriptor
 * @param diagnoser
 */
export function behaviorpack_check_blockdescriptor(blockDescriptor: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  behaviorpack_check_blockid(blockDescriptor, diagnoser);
  behaviorpack_check_blockstates(blockDescriptor, diagnoser);
}

/**Checks if the blocks exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_check_blockid(blockDescriptor: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  let id = Minecraft.Block.getId(blockDescriptor.text);

  //Defined in McProject
  if (check_definition_value(diagnoser.project.definitions.block, id, diagnoser)) return;
  const data = diagnoser.context.getCache();

  //Project has block
  if (data.hasBlock(id)) return;

  const edu = education_enabled(diagnoser);

  //Vanilla has block
  if (MinecraftData.BehaviorPack.hasBlock(id, edu)) return;

  //Missing namespace?
  if (!id.includes(":")) {
    //retry
    id = "minecraft:" + id;

    //Defined in McProject
    if (check_definition_value(diagnoser.project.definitions.block, id, diagnoser)) return;

    //Project has block
    if (data.hasBlock(id)) return;
  }
  
  //Vanilla has block
  if (MinecraftData.BehaviorPack.hasBlock(id, edu)) return;

  //Nothing then report error
  diagnoser.Add(id, `Cannot find block definition: ${id}`, DiagnosticSeverity.error, "behaviorpack.block.missing");
}

/**Checks if the blocks exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_check_blockstates(blockDescriptor: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  //If the block has no states then skip
  if (!blockDescriptor.text.includes("[")) return;

  //Parses states
  const blockData = Minecraft.Block.fromBlockDescriptor(blockDescriptor.text);

  const data = diagnoser.context.getCache();
  const block = data.BehaviorPacks.blocks.get(blockData.id);

  //No block found, expecting behaviorpack_check_blockid has been run
  if (!block) return;

  if (block.states.length == 0 && blockData.states.length > 0) {
    //Block has not defined states, but states are being used

    diagnoser.Add(
      blockDescriptor,
      `Block: ${block.id} has no defined states, but the block descriptor does: '${blockDescriptor}'`,
      DiagnosticSeverity.error,
      "behaviorpack.block.states.missing"
    );

    return;
  }

  for (var I = 0; I < blockData.states.length; I++) {
    const state = blockData.states[I];
    check_state(blockDescriptor, state, block, diagnoser);
  }
}

/**
 * 
 * @param blockDescriptor 
 * @param state 
 * @param data 
 * @param diagnoser 
 * @returns 
 */
function check_state(blockDescriptor: Types.OffsetWord, state: Minecraft.BlockState, data: BehaviorPack.Block.Block, diagnoser: DiagnosticsBuilder) {
  for (var I = 0; I < data.states.length; I++) {
    const stateData = data.states[I];

    //If found state with the same name
    if (stateData.name === state.property) {
      if (!stateData.values.includes(state.value)) {
      }

      return;
    }
  }

  //No state matching found
  diagnoser.Add(blockDescriptor, `Missing state: '${state.property}' in the block definition: '${data.id}'`, DiagnosticSeverity.error, "behaviorpack.block.states.missing");
}
