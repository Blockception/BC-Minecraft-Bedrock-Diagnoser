export interface OffsetWord {
  text: string;
  offset: number;
}

export namespace OffsetWord {
  /**
   *
   * @param text
   * @param number
   * @returns
   */
  export function create(text: string, number: number = 0): OffsetWord {
    return { text: text, offset: number };
  }
}
