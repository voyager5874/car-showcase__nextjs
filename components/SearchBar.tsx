"use client";

import Image from "next/image";
import { FormEvent, HTMLProps, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSearchParams } from "@/utils/updateSearchParams";
import { carManufacturers } from "@/constants";
import { SearchableOptions } from "@/components/SearchableOptions";
import { CarType } from "@/types";
import { GetModelsForMakeResponse } from "@/services/nhtsa/types";

const SearchButton = ({ className }: HTMLProps<HTMLButtonElement>) => (
  <button type="submit" className={`z-10 ${className}`}>
    <Image
      src={"/magnifying-glass.svg"}
      alt={"magnifying glass"}
      width={40}
      height={40}
      className="object-contain"
    />
  </button>
);

export const SearchBar = () => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState<string | null>(null);
  const [modelOptions, setModelOptions] = useState<string[]>([]);

  const router = useRouter();

  const params = useSearchParams();
  // const modelQuery = params.get("model");

  useEffect(() => {
    if (!manufacturer) return;
    const fetchModels = async () => {
      try {
        const res: GetModelsForMakeResponse = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${manufacturer}?format=json`
        ).then((res) => res.json());
        console.log("models", res.Results);
        const optionsWithId = res.Results.map((item) => ({
          id: item.Model_ID,
          name: item.Model_Name,
        }));
        const options = res.Results.map((item) => item.Model_Name);
        setModelOptions(options);
      } catch (err) {
        setModelOptions([]);
      }
    };
    fetchModels().then((_) => {});
  }, [manufacturer]);

  useEffect(() => {
    const manufacturerQuery = params.get("make");
    if (!manufacturerQuery) return;
    const option = carManufacturers.find(
      (make) => make.toLowerCase() === manufacturerQuery
    );
    if (option) setManufacturer(option);
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      manufacturer &&
      model &&
      manufacturer.trim() === "" &&
      model.trim() === ""
    ) {
      //todo toastify this, show headless ui dialog?
      return alert("Please provide some input");
    }

    const searchString = updateSearchParams({
      model: model ? model.toLowerCase() : "",
      make: manufacturer.toLowerCase(),
    });
    router.push(searchString, { scroll: false });
  };

  return (
    <form
      className="flex items-center justify-start max-sm:flex-col w-full relative max-sm:gap-4 max-w-3xl"
      onSubmit={handleSearch}
    >
      <div className="searchbar__item">
        <SearchableOptions
          allowCustomValues={false}
          options={carManufacturers}
          onChange={setManufacturer}
          selected={manufacturer}
          inputTailwindClassNames={"rounded-l-full max-sm:rounded-full"}
        />
        <SearchButton className="sm:hidden absolute right-1" />
      </div>
      <div className="searchbar__item">
        <Image
          src="/model-icon.png"
          width={25}
          height={25}
          className="absolute w-[20px] h-[20px] ml-4"
          alt="car model"
        />
        <SearchableOptions
          allowCustomValues={true}
          options={modelOptions}
          onChange={setModel}
          selected={model}
          inputTailwindClassNames={"rounded-r-full max-sm:rounded-full"}
        />
        <SearchButton className="sm:hidden absolute right-1" />
      </div>
      <SearchButton className="max-sm:hidden absolute right-1" />
    </form>
  );
};
