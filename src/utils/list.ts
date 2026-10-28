export const at = <T>(list: ArrayLike<T>, index: number): T => {
  const item = list[index];
  if (item === undefined) throw new RangeError(`No item at ${index} of ${list.length}`);
  return item;
};

export const pick = <T>(list: ArrayLike<T>, random: number): T => at(list, Math.floor(random * list.length));
