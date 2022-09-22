import { animation_or_controller_diagnose_implementation } from "../anim or controller";
import { behaviorpack_animation_used } from "../Animation/usage";
import { behaviorpack_entity_check_events } from "./events";
import { behaviorpack_entity_components_check, behaviorpack_entity_components_dependencies } from "./components";
import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { diagnose_molang } from "../../Molang/diagnostics";
import { diagnose_script } from "../../Minecraft/Script";
import { DiagnosticsBuilder } from "../../../Types";
import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { Json } from "../../Json/Json";
import { Types } from "bc-minecraft-bedrock-types";
import { getUsedComponents } from "./Entity";
import { Context } from "./components/context";

/**Diagnoses the given document as an bp entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(doc.getText(), "Entities", diagnoser);

  const entity = Json.LoadReport<Internal.BehaviorPack.Entity>(doc, diagnoser);

  if (!Internal.BehaviorPack.Entity.is(entity)) return;

  //No resourcepack check, entities can exist without their rp side

  //check components
  const context: Context = {
    components: getUsedComponents(entity),
  };

  behaviorpack_entity_components_dependencies(entity, context, diagnoser);
  behaviorpack_entity_components_check(entity, context, diagnoser);

  const container = entity["minecraft:entity"];
  const MolangData = Molang.MolangFullSet.harvest(container);
  const id = container.description.identifier;

  const owner = {
    id: id,
    molang: MolangData,
    animations: DefinedUsing.create<string>(),
  };

  //Convert animations / controllers
  Types.Definition.forEach(container.description.animations, (ref, anim_id) => {
    owner.animations.defined.push(ref);
    owner.animations.using.push(anim_id);
  });

  //Check animations / animation controllers implements
  owner.animations.using.forEach((anim_id) =>
    animation_or_controller_diagnose_implementation(anim_id, owner, "Entities", diagnoser)
  );

  //Script check
  if (container.description.scripts)
    diagnose_script(diagnoser, container.description.scripts, container.description.animations);

  //Check events
  if (container.events) behaviorpack_entity_check_events(container.events, diagnoser, container.component_groups);

  //Check used animations
  behaviorpack_animation_used(container.description.animations, diagnoser, container.description.scripts);
}
