export type Depended = string | RegExp;
export type DependedMap = Record<string, Depended[]>;

/**
 *
 */
export interface Context {
  /**
   *
   */
  components: string[];
}
