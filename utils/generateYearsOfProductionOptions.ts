export const generateYearsOfProductionOptions = (
  start: number,
  end?: number
): Array<{ title: string; value: string }> => {
  const currentYear = new Date().getFullYear();
  const options = [{ title: "Year", value: "" }];

  start = Math.max(start, 1980);
  start = Math.min(start, currentYear - 1);

  if (end) {
    end = Math.min(end, currentYear);
  }

  for (let i = start; end ? i <= end : i <= currentYear; i++) {
    options.push({ title: `${i}`, value: `${i}` });
  }

  return options;
};
