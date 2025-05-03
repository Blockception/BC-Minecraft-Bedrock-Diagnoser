import { Defined, Using } from "bc-minecraft-molang";

/**
 * Iterates over the given data
 * @param data A Using, Defined, or an array of T
 * @param callback The callback to call
 * @returns void
 * @example forEach(Using.create(["a", "b", "c"]), (v)=>console.log(v));
 */
export function forEach<T>(data: Using<T> | Defined<T> | T[] | undefined, callback: (key: T) => void): void {
  if (data === undefined) return;

  if (Array.isArray(data)) {
    return data.forEach((v) => callback(v));
  }
  if (Using.is(data)) {
    data.using.forEach((v) => callback(v));
  }
  if (Defined.is(data)) {
    data.defined.forEach((v) => callback(v));
  }
}
