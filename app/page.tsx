import { Hero } from "@/components";
import { SearchBar } from "@/components";
import { SearchParamsType } from "@/types";
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
  if (!yearSearchParam && !searchParams.make && !searchParams.model) {
    // yearSearchParam = new Date().getFullYear();
    yearSearchParam = 2023;
  }
  const allCars = await fetchCars({
    make: searchParams.make,
    year: yearSearchParam,
    fuel_type: searchParams.fuel_type,
    limit: searchParams.limit || 10,
    model: searchParams.model,
    //to not show almost identical CarCards
    drive: "fwd",
    transmission: "a",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="flex flex-col items-start justify-start gap-y-2.5 text-black-100">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>
        <div className="mt-12 w-full flex-between items-center flex-wrap gap-5">
          <SearchBar />
          <div className="flex justify-start flex-wrap items-center gap-2">
            <div className="flex justify-start flex-wrap items-center gap-2">
              <Filter title="fuel_type" options={fuels} />
              <Filter
                title="year"
                options={generateYearsOfProductionOptions(1985)}
              />
            </div>
          </div>
        </div>
        {!isDataEmpty ? (
          <section>
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 w-full gap-8 pt-14">
              {allCars?.map((car) => (
                <CarCard
                  car={car}
                  key={car?.id || Object.values(car).join("-")}
                />
              ))}
            </div>
            <ShowMoreButton
              allShown={(searchParams.limit || 10) > allCars.length}
              pageNumber={(searchParams.limit || 10) / 10}
            />
          </section>
        ) : (
          <div className="mt-16 flex justify-center items-center flex-col gap-2 min-h-[200px]">
            <h2 className="text-black text-xl font-bold">Oops, no results</h2>
          </div>
        )}
      </div>
    </main>
  );
}
