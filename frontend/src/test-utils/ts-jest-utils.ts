// Minimal shim for ts-jest/utils `mocked` helper to work with Vitest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mocked<T>(item: T): any {
  return item as any
}

