import { DiagnoserContext } from "./DiagnoserContext";

/**An object that carriers Diagnoser context*/
export interface DiagnoserContextCarrier {
  /**The context needed to diagnose*/
  readonly context: DiagnoserContext;
}

/**
 *
 */
export namespace DiagnoserContextCarrier {
  /**
   *
   * @param value
   */
  export function is(value: any): value is DiagnoserContextCarrier {
    if (typeof value === "object") {
      if (DiagnoserContext.is(value.context)) return true;
    }

    return false;
  }
}
