import { CarType, SearchParamsType } from "@/types";
import { stripObjectEmptyProperties } from "./stripObjectEmptyProperties";

export async function fetchCars(
  filters: SearchParamsType
): Promise<CarType[] | string> {
  const url = new URL(process.env.CARS_INFO_BASE_URL!);

  const nonEmptyFilters = stripObjectEmptyProperties(filters);
  console.log("filters", nonEmptyFilters);
  const filtersApplied =
    Object.getOwnPropertyNames(nonEmptyFilters).length !== 0;

  if (filtersApplied) {
    const params = new URLSearchParams(nonEmptyFilters as any).toString();
    url.search = params.toString();
  }

  console.log("url", url);

  const headers: HeadersInit = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_API_KEY!,
    "X-RapidAPI-Host": process.env.CARS_INFO_HOST!,
  };
  try {
    // Set the required headers for the API request
    const response = await fetch(
      // `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&limit=${limit}&fuel_type=${fuel}`,
      url.toString(),
      {
        headers: headers,
      }
    );

    // Parse the response as JSON
    const result = await response.json();
    console.log("fetch util", result);
    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "error getting car data";
    console.log(error);
    return message;
  }
}
