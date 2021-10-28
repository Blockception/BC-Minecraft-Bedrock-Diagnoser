import { Internal, TextDocument } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { Json } from "../../Json/Json";
import { behaviorpack_entity_components_dependencies } from "./components";
import { animation_or_controller_diagnose_implementation } from "../anim or controller";
import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { Types } from "bc-minecraft-bedrock-types";
import { diagnose_molang } from "../../Molang/diagnostics";
import { diagnose_script } from "../../Minecraft/Script";
import { behaviorpack_entity_check_events } from "./events";

/**Diagnoses the given document as an bp entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(doc.getText(), "entity", diagnoser);

  const entity = Json.LoadReport<Internal.BehaviorPack.Entity>(doc, diagnoser);

  if (!Internal.BehaviorPack.Entity.is(entity)) return;

  //No resourcepack check, entities can exist without their rp side

  //check components
  behaviorpack_entity_components_dependencies(entity, diagnoser);

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
  owner.animations.using.forEach((anim_id) => animation_or_controller_diagnose_implementation(anim_id, owner, "entity", diagnoser));

  //Script check
  if (container.description.scripts) diagnose_script(diagnoser, container.description.scripts, container.description.animations);

  //Check events
  if (container.events) behaviorpack_entity_check_events(container.events, diagnoser, container.component_groups);
}
