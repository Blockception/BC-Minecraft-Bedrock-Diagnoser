import { AnimationCarrier, MolangCarrier, SMap } from "bc-minecraft-bedrock-project";
import { Types } from "bc-minecraft-bedrock-types";
import { DefinedUsing, Molang } from "bc-minecraft-molang";

/**
 * The type that is used to store the animation data & molang data
 */
export type EntityAnimationMolangCarrier = Types.Identifiable &
  MolangCarrier<Molang.MolangSetOptional> &
  AnimationCarrier<DefinedUsing<string>>;

export interface EventCarrier {
  events?: SMap<any>;
}
