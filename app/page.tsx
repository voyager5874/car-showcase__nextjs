import { Hero } from "@/components";
import { SearchBar } from "@/components";
import { fetchCars } from "@/utils/rapid-api";
import { SearchParamsType } from "@/types";
import { CarCard } from "@/components";
import { fuels } from "@/constants/fuels";
import { yearsOfProduction } from "@/constants/years-of-production";
import { Filter } from "@/components/Filter";
import { ShowMoreButton } from "@/components/ShowMoreButton";

type PropsType = {
  searchParams: SearchParamsType;
};
export default async function Home({ searchParams }: PropsType) {
  const allCars = await fetchCars({
    make: searchParams.make,
    year: searchParams.year || new Date().getFullYear(),
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
          <SearchBar />
          <div className="home__filter-container">
            <div className="home__filter-container">
              <Filter title="fuel_type" options={fuels} />
              <Filter title="year" options={yearsOfProduction} />
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
            <p>{JSON.stringify(allCars)}</p>
          </div>
        )}
      </div>
    </main>
  );
}
