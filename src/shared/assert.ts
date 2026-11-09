export function assertDefined<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) {
    throw new Error(`${label} is not defined`);
  }

  return value;
}
