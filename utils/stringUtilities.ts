export function removeBetweenBracketsText(str: string) {
  let startIndex = str.indexOf("(");
  if (startIndex !== -1) {
    let endIndex = str.indexOf(")", startIndex);
    if (endIndex !== -1) {
      return str.slice(0, startIndex) + str.slice(endIndex + 1);
    }
  }
  return str;
}
