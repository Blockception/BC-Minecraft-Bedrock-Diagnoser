import { Minecraft } from "bc-minecraft-bedrock-types";
import { minecraft_tag_diagnose } from "../../Tag";
import { DiagnosticsBuilder, DiagnosticSeverity } from '../../../../Types';
import { behaviorpack_item_diagnose } from '../../../BehaviorPack/Item';

export function diagnose_filter_has_equipment(filter: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) {
  const item = filter.value;

  if (!item || typeof item !== 'string') return

  behaviorpack_item_diagnose(item, diagnoser);
}
