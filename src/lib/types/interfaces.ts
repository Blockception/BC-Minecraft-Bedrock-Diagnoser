import { AnimationCarrier, MolangCarrier } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { DefinedUsing } from "bc-minecraft-molang";

/**
 * The type that is used to store the animation data & molang data
 */
export type EntityAnimationMolangCarrier = Types.Identifiable & MolangCarrier & AnimationCarrier<DefinedUsing<string>>;

export interface EventCarrier {
  events?: Map<string, any>;
}
