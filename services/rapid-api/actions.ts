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

  const headers: HeadersInit = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_API_KEY!,
    "X-RapidAPI-Host": process.env.CARS_INFO_HOST!,
  };
  try {
    const response = await fetch(
      // `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&limit=${limit}&fuel_type=${fuel}`,
      url.toString(),
      {
        headers: headers,
      }
    );
    const json = await response.json();
    console.log("cars list", json);
    return json;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "error getting car data";
    console.error(message);
    return null;
  }
}
