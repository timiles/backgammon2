export function distinct<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index;
}

export function repeat<T>(itemCreator: () => T, times: number): T[] {
  return new Array(times).fill(0).map(() => itemCreator());
}
