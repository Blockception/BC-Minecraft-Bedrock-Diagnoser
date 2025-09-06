import { TextDocument } from "bc-minecraft-bedrock-project";
import { General, Types } from "bc-minecraft-bedrock-types";

interface Item extends Types.OffsetWord {
  data?: number;
}

export function minecraft_get_item(value: string, doc: TextDocument): Item {
  const offset = doc.getText().indexOf(value);

  // Remove number from item
  const i = value.lastIndexOf(":");
  if (i > 0) {
    const last = value.slice(i + 1);
    if (General.Integer.is(last)) {
      value = value.slice(0, i);
    }
  }

  return { offset: offset, text: value };
}
