export function getAnotherItemFromArray(arr: string[], index: number) {
  index = (index % arr.length) - 1;
  if (index < 0) {
    index = 0;
  }
  return arr[index];
}
