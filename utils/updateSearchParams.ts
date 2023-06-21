import { CarType, SearchParamsType } from "@/types";

// const replaceSearchParams = (query: Partial<CarType>) => {
//   const searchParams = new URLSearchParams(window.location.search);
//   for (const property of carProperties) {
//     if (
//       query.hasOwnProperty(property) &&
//       query[property as keyof CarType] !== undefined &&
//       query[property as keyof CarType] !== ""
//     ) {
//       const encodedKey = encodeURIComponent(property);
//       const encodedValue = encodeURIComponent(
//         query[property as keyof CarType]!
//       );
//       searchParams.set(encodedKey, encodedValue);
//     } else {
//       searchParams.delete(property);
//     }
//   }
//   return `${window.location.pathname}?${searchParams.toString()}`;
// };
export const updateSearchParams = (query: SearchParamsType) => {
  const searchParams = new URLSearchParams(window.location.search);

  for (const property in query) {
    if (
      query.hasOwnProperty(property) &&
      query[property as keyof CarType] !== undefined &&
      query[property as keyof CarType] !== ""
    ) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(
        query[property as keyof CarType]!
      );
      searchParams.set(encodedKey, encodedValue);
    } else {
      searchParams.delete(property);
    }
  }
  return `${window.location.pathname}?${searchParams.toString()}`;
};
