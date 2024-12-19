export function verify(
  value: unknown,
  throwable: Error | string
): asserts value {
  if (value) return;

  if (throwable instanceof Error) throw throwable;
  else throw new Error(throwable);
}
