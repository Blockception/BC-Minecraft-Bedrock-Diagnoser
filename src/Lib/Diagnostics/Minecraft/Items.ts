import { DiagnosticsBuilder } from '../../Types/DiagnosticsBuilder/include';
import { Types} from 'bc-minecraft-bedrock-types';
import { TextDocument } from 'bc-minecraft-bedrock-project';
import { behaviorpack_item_diagnose } from '../BehaviorPack/Item/diagnose';

interface Item extends Types.OffsetWord {
  data?: number;
}

/**@deprecated */
export function minecraft_item_diagnose(value: Item, diagnoser: DiagnosticsBuilder): boolean {
  return behaviorpack_item_diagnose(value, diagnoser);
}

export function minecraft_get_item(value : string, doc : TextDocument) : Item {
  let offset = doc.getText().indexOf(value);
  let index = value.indexOf(":")

  if (index === -1) return {offset:offset,text:value};

  let second = value.indexOf(':', index + 1);

  if (second === -1) return {offset:offset,text:value};

  return {offset:offset,text:value.substring(0, second)};
}