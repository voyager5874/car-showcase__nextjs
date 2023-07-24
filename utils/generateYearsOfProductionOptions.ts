export const generateYearsOfProductionOptions = (
  start: number,
  end?: number
): Array<{ title: string; value: string }> => {
  const currentYear = new Date().getFullYear();
  const options = [{ title: "Year", value: "" }];
  if (start > currentYear) {
    options.push({ title: `${currentYear - 1}`, value: `${currentYear - 1}` });
  }
  if (start <= 1980) {
    options.push({ title: "1980", value: "1980" });
    options.push({ title: `${currentYear - 1}`, value: `${currentYear - 1}` });
  }
  if (end) {
    for (let i = start; i <= end; i++) {
      options.push({ title: `${i}`, value: `${i}` });
    }
  } else {
    for (let i = start; i <= currentYear; i++) {
      options.push({ title: `${i}`, value: `${i}` });
    }
  }

  return options;
};
