import { animation_or_controller_diagnose_implementation } from "../anim or controller";
import { behaviorpack_animation_used } from "../Animation/usage";
import { behaviorpack_entity_check_events } from "./events";
import { behaviorpack_entity_components_check } from "./components";
import { behaviorpack_entity_components_dependencies } from "./components/dependencies";
import { Context } from "../../../utility/components";
import { DefinedUsing, Molang } from "bc-minecraft-molang";
import { diagnose_molang } from "../../Molang/diagnostics";
import { diagnose_script } from "../../Minecraft/Script";
import { DiagnosticSeverity, DocumentDiagnosticsBuilder } from "../../../Types";
import { getUsedComponents } from "bc-minecraft-bedrock-types/lib/src/minecraft/components";
import { Internal } from "bc-minecraft-bedrock-project";
import { Json } from "../../Json/Json";
import { Types } from "bc-minecraft-bedrock-types";
import { diagnose_entity_properties_definition } from "./properties";
import { AnimationUsage } from "../../Minecraft";
import { EntityProperty as DefinedEP } from "bc-minecraft-bedrock-project/lib/src/Lib/Internal/BehaviorPack/Entity";
import { EntityProperty as ProjectEP } from "bc-minecraft-bedrock-project/lib/src/Lib/Project/BehaviorPack/Entity";

/**Diagnoses the given document as an bp entity
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(diagnoser: DocumentDiagnosticsBuilder): void {
  //Check molang
  diagnose_molang(diagnoser.document.getText(), "Entities", diagnoser);

  const entity = Json.LoadReport<Internal.BehaviorPack.Entity>(diagnoser);
  if (!Internal.BehaviorPack.Entity.is(entity)) return;

  //No resource-pack check, entities can exist without their rp side

  //check components
  const context: Context = {
    components: getUsedComponents(entity["minecraft:entity"]),
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
  const properties = Object.entries(container.description.properties ?? {})?.map(([name, value]) =>
    propertyToProjectProperty(name, value)
  );

  //Convert animations / controllers
  Types.Definition.forEach(container.description.animations, (ref, anim_id) => {
    owner.animations.defined.push(ref);
    owner.animations.using.push(anim_id);
  });

  //Check animations / animation controllers implements
  owner.animations.using.forEach((anim_id) =>
    animation_or_controller_diagnose_implementation(anim_id, owner, "Entities", diagnoser)
  );

  //@ts-ignore
  if (container["permutations"]) diagnoser.add(
    `permutations`,
    `Entity permutations have been deprecated.`,
    DiagnosticSeverity.error,
    "behaviorpack.entity.permutations"
  );

  //@ts-ignore
  if (container.description["aliases"]) diagnoser.add(
    `aliases`,
    `Entity aliases have been deprecated.`,
    DiagnosticSeverity.error,
    "behaviorpack.entity.aliases"
  );

  //Script check
  if (container.description.scripts)
    diagnose_script(diagnoser, container.description.scripts, container.description.animations);

  //Check used animations
  const anim_data: AnimationUsage = {
    animation_controllers: {},
    animations: container.description.animations ?? {},
    script: container.description.scripts ?? {},
  };

  behaviorpack_animation_used(anim_data, diagnoser);

  diagnose_entity_properties_definition(properties, diagnoser);

  //Check events
  if (container.events)
    behaviorpack_entity_check_events(container.events, diagnoser, properties, container.component_groups);
}

function propertyToProjectProperty(name: string, value: DefinedEP): ProjectEP {
  switch (value.type) {
    case "bool":
      return {
        name: name,
        type: value.type,
        default: value.default == true,
      };
    case "float":
    case "int":
      return {
        name: name,
        type: value.type,
        default: Number(value.default),
        range: value.range,
      };
    case "enum":
      return {
        name: name,
        type: "enum",
        default: value.default,
        values: value.values,
        client_sync: value.client_sync,
      };
  }
}
