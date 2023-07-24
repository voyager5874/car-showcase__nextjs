import { Hero } from "@/components";
import { SearchBar } from "@/components";
import { CarType, SearchParamsType } from "@/types";
import { CarCard } from "@/components";
import { fuels } from "@/constants/fuels";
import { Filter } from "@/components/Filter";
import { ShowMoreButton } from "@/components/ShowMoreButton";
import { fetchCars } from "@/services/rapid-api/actions";
import { generateYearsOfProductionOptions } from "@/utils/generateYearsOfProductionOptions";

type PropsType = {
  searchParams: SearchParamsType;
};
export default async function Home({ searchParams }: PropsType) {
  let yearSearchParam = searchParams.year;
  // no images for cars older than 2015
  //todo: use another source for images at least for those which older than 2015

  // if (!searchParams.make && !searchParams.year) {
  if (!searchParams.year) {
    yearSearchParam = new Date().getFullYear();
  }
  const allCars = await fetchCars({
    make: searchParams.make,
    year: yearSearchParam,
    fuel_type: searchParams.fuel_type,
    limit: searchParams.limit || 10,
    model: searchParams.model,
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar cars={allCars?.length ? (allCars as CarType[]) : []} />
          <div className="home__filter-container">
            <div className="home__filter-container">
              <Filter title="fuel_type" options={fuels} />
              <Filter
                title="year"
                options={generateYearsOfProductionOptions(1990)}
              />
            </div>
          </div>
        </div>
        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} key={Object.values(car).join("")} />
              ))}
            </div>
            <ShowMoreButton
              allShown={(searchParams.limit || 10) > allCars.length}
              pageNumber={(searchParams.limit || 10) / 10}
            />
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
          </div>
        )}
      </div>
    </main>
  );
}
