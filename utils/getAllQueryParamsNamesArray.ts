export const getAllQueryParamsNamesArray = (): string[] => {
  const res = [] as string[];
  const searchParams = new URLSearchParams(window.location.search);
  // @ts-ignore
  for (const key of searchParams.keys()) {
    res.push(key);
  }
  console.log(res);
  return res;
};
