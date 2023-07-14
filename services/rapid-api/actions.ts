import { CarType, SearchParamsType } from "@/types";
import { stripObjectEmptyProperties } from "@/utils/stripObjectEmptyProperties";

export async function fetchCars(
  filters: SearchParamsType
): Promise<CarType[] | null> {
  const url = new URL(process.env.CARS_INFO_BASE_URL!);

  const nonEmptyFilters = stripObjectEmptyProperties(filters);
  const filtersApplied =
    Object.getOwnPropertyNames(nonEmptyFilters).length !== 0;

  if (filtersApplied) {
    const params = new URLSearchParams(nonEmptyFilters as any).toString();
    url.search = params.toString();
  }

  console.log("fetchCars/url", url);

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
    const res = await response.json();
    console.log("fetchCars/response.json()", res);
    return res;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "error getting car data";
    console.log("fetchCars/catch", error);
    console.error(message);
    return null;
  }
}
