import { BehaviorPack } from 'bc-minecraft-bedrock-project';
import { Types, Minecraft } from 'bc-minecraft-bedrock-types';
import { DocumentLocation, Location } from 'bc-minecraft-bedrock-types/lib/src/types';
import { MinecraftData } from 'bc-minecraft-bedrock-vanilla-data';
import { MolangSet } from 'bc-minecraft-molang/lib/src/Molang';
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../Types';
import { education_enabled } from '../../Definitions';

/** Checks if the blocks exists in the project or in vanilla, if not then a bug is reported
 * @param id
 * @param diagnoser
 * @returns
 */
export function behaviorpack_check_blockstates(blockDescriptor: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  //If the block has no states then skip
  if (!blockDescriptor.text.includes("[")) return;

  //Parses states
  const blockData = Minecraft.Block.fromBlockDescriptor(blockDescriptor.text);

  // ^ Returns ['"state"'] instead of ['state']; this fixes that
  blockData.states.forEach(state => {
    if (state.property.startsWith('"') && state.property.endsWith('"')) state.property = state.property.substring(1, state.property.length - 1)
  })

  check_block_definition(blockData, blockDescriptor, diagnoser);
}

/**
 * 
 * @param blockId 
 * @param states 
 * @param diagnoser 
 */
export function behaviorpack_check_command_blockstates(blockId: Types.OffsetWord, states: Types.OffsetWord, diagnoser: DiagnosticsBuilder): void {
  const blockData: Minecraft.Block = {
    id: blockId.text,
    location: Location.empty(),
    states: [],
  }

  // Is state properly formatted?
  if (states.text.startsWith('[') && states.text.endsWith(']')) {
    const value = states.text.substring(1, states.text.length - 1);
    const split = value.split(',');

    // For each state
    for (var I = 0; I < split.length; I++) {
      const item = split[I];
      const state = split[I].split('=').map(part => part.trim());

      // Is state properly defined
      if (state.length == 2) {
        let [property, value] = state;

        // property is a string literal?
        if (property.startsWith('"') && property.endsWith('"')) {
          property = property.substring(1, property.length - 1);
          blockData.states.push({value, property});

        } else {
          diagnoser.add(
            blockId,
            `Invalid state: '${property}' in '${item}' on the block state definition: '${states.text}', needs to be a string literal with ""`,
            DiagnosticSeverity.error,
            "behaviorpack.block.states.invalid"
          );
        }
      }
      else if (state[0] !== "") {
        diagnoser.add(
          states,
          `Invalid state: '${item}' in the block command, needs to be in the format ["state"=value] :`,
          DiagnosticSeverity.error,
          "behaviorpack.block.states.invalid"
        );
      }
    }

  } else {
    diagnoser.add(
      states,
      `Invalid states: '${states.text}' in the block command, needs to be a list with []`,
      DiagnosticSeverity.error,
      "behaviorpack.block.states.invalid"
    );
  }

  check_block_definition(blockData, states, diagnoser);
}

function check_block_definition(blockDefinition: Minecraft.Block, location: DocumentLocation, diagnoser: DiagnosticsBuilder) {
  const data = diagnoser.context.getCache();
  const block = data.behaviorPacks.blocks.get(blockDefinition.id) ?? vanilla_block(diagnoser, blockDefinition.id);

  //No block found, expecting behaviorpack_check_blockId has been run
  if (!block) return;

  if (block.states.length == 0 && blockDefinition.states.length > 0) {
    //Block has not defined states, but states are being used

    diagnoser.add(
      location,
      `Block: ${block.id} has no defined states`,
      DiagnosticSeverity.error,
      "behaviorpack.block.states.missing"
    );

    return;
  }

  for (var I = 0; I < blockDefinition.states.length; I++) {
    const state = blockDefinition.states[I];
    check_state(state, block, location, diagnoser);
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
function check_state(
  state: Minecraft.BlockState,
  data: BehaviorPack.Block.Block,
  location: DocumentLocation,
  diagnoser: DiagnosticsBuilder
) {
  for (var I = 0; I < data.states.length; I++) {
    const stateData = data.states[I];

    //If found state with the same name
    if (stateData.name === state.property) {
      let actual = state.value;
      const values = stateData.values;

      if (stateData.type === "string") {
        if (actual.startsWith('"') && actual.endsWith('"')) {
          actual = actual.substring(1, actual.length - 1);
        } else {
          diagnoser.add(
            location,
            `Invalid state value: '${state.value}' for state: '${state.property}' in the block definition: '${
              data.id
            }', needs to be a string literal with ""`,
            DiagnosticSeverity.error,
            "behaviorpack.block.states.invalid"
          );

          return;
        }
      }

      //Check if the state value is valid
      for (let expect of values) {
        // Compare int/bool/string values
        if (String(expect) == actual) { // String() because "true" != true unlike "2" == 2
          return;
        }
      }

      diagnoser.add(
        location,
        `Invalid state value: '${state.value}' for state: '${state.property}' in the block definition: '${
          data.id
        }'\nValid values are: ${values.join(",")}`,
        DiagnosticSeverity.error,
        "behaviorpack.block.states.invalid"
      );

      return;
    }
  }

  //No state matching found
  diagnoser.add(
    location,
    `Missing state: '${state.property}' in the block definition: '${data.id}'`,
    DiagnosticSeverity.error,
    "behaviorpack.block.states.missing"
  );
}

function vanilla_block(diagnoser: DiagnosticsBuilder, blockId: string): BehaviorPack.Block.Block | undefined {
  if (!blockId.startsWith("minecraft:")) {
    blockId = `minecraft:${blockId}`;
  }

  const edu = education_enabled(diagnoser);
  const block = MinecraftData.BehaviorPack.getBlock(blockId, edu);

  if (block) {
    const result: BehaviorPack.Block.Block = {
      id: block.id,
      molang: MolangSet.create(),
      location: Types.Location.empty(),

      states: [],
    };

    for (let prop of block.properties) {
      const state = MinecraftData.BehaviorPack.getBlockState(prop);
      if (state) result.states.push(state);
    }

    return result;
  }

  return undefined;
}