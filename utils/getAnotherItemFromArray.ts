export function getAnotherItemFromArray(
  arr: string[],
  shift: number,
  restrict?: number
) {
  if (shift < 0) {
    shift = 0;
  }
  shift = shift % arr.length;

  if (!restrict || arr.length <= 1) {
    return arr[shift];
  }

  restrict = restrict % arr.length;

  while (true) {
    if (shift !== restrict) {
      break;
    }
    shift++;
    shift = shift % arr.length;
  }

  return arr[shift];
}
