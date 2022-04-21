import { Types} from 'bc-minecraft-bedrock-types';
import { TextDocument } from 'bc-minecraft-bedrock-project';

interface Item extends Types.OffsetWord {
  data?: number;
}

export function minecraft_get_item(value : string, doc : TextDocument) : Item {
  const offset = doc.getText().indexOf(value);
  const index = value.indexOf(":")
  if (index === -1) return {offset:offset,text:value};

  const second = value.indexOf(':', index + 1);
  if (second === -1) return {offset:offset,text:value};

  return {offset:offset,text:value.substring(0, second)};
}