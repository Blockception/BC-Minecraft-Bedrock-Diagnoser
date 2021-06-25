import { DataSet, Json, Locatable, TextDocument } from "bc-minecraft-bedrock-project";
import { Identifiable } from "bc-minecraft-bedrock-vanilla-data/lib/src/Lib/Types/Identifiable";
import { DiagnoserContextCarrier } from "../Context/ContextCarrier";

/**
 *
 */
export interface ContentItem<Full, Cache, Vanilla> {
  /**
   *
   * @param id
   */
  get(id: string): Cache | Vanilla | undefined;

  /**
   *
   * @param id
   */
  has(id: string): boolean;

  /**
   *
   * @param id
   */
  getFull(id: string): Full | Vanilla | undefined;

  /**
   *
   * @param id
   */
  getDocument(id: string): TextDocument | undefined;
}

/** */
export namespace ContentItem {
  /**
   *
   * @param DataSet
   * @param Context
   * @returns
   */
  export function create<Full, Cache extends Identifiable & Locatable, Vanilla>(DataSet: DataSet<Cache, Vanilla>, Context: DiagnoserContextCarrier) {
    return new _ContentItem(DataSet, Context);
  }
}

class _ContentItem<Full, Cache extends Identifiable & Locatable, Vanilla> implements ContentItem<Full, Cache, Vanilla> {
  readonly __dataset: DataSet<Cache, Vanilla>;
  readonly __context: DiagnoserContextCarrier;

  constructor(DataSet: DataSet<Cache, Vanilla>, Context: DiagnoserContextCarrier) {
    this.__dataset = DataSet;
    this.__context = Context;
  }

  has(id: string): boolean {
    return this.__dataset.has(id);
  }

  get(id: string): Cache | Vanilla | undefined {
    return this.__dataset.get(id);
  }

  getDocument(id: string): TextDocument | undefined {
    const item = this.get(id);

    if (Locatable.is(item)) {
      return this.__context.context.getDocument(item.location.uri);
    }

    return undefined;
  }

  getFull(id: string): Full | Vanilla | undefined {
    const item = this.get(id);

    if (Locatable.is(item)) {
      const temp = this.__context.context.getDocument(item.location.uri);

      if (temp) {
        const out = Json.To<Full>(temp);

        return out;
      }

      return undefined;
    }

    return item;
  }
}
