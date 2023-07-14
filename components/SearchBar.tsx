"use client";

import Image from "next/image";
import { FormEvent, HTMLProps, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateSearchParams } from "@/utils/updateSearchParams";
import { carManufacturers } from "@/constants";
import { SearchableOptions } from "@/components/SearchableOptions";
import { CarType } from "@/types";

const SearchButton = ({ className }: HTMLProps<HTMLButtonElement>) => (
  <button type="submit" className={`-ml-3 z-10 ${className}`}>
    <Image
      src={"/magnifying-glass.svg"}
      alt={"magnifying glass"}
      width={40}
      height={40}
      className="object-contain"
    />
  </button>
);

type Props = {
  cars: CarType[];
};
export const SearchBar = ({ cars }: Props) => {
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  const router = useRouter();

  const params = useSearchParams();
  const modelQuery = params.get("model");
  const modelOptions = cars?.length ? cars?.map((car) => car.model) : [];
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

    if (manufacturer.trim() === "" && model.trim() === "") {
      return alert("Please provide some input");
    }

    const searchString = updateSearchParams({
      model: model.toLowerCase(),
      make: manufacturer.toLowerCase(),
    });
    router.push(searchString, { scroll: false });
  };

  return (
    <form className="searchbar" onSubmit={handleSearch}>
      <div className="searchbar__item">
        <SearchableOptions
          options={carManufacturers}
          onChange={setManufacturer}
          selected={manufacturer}
          inputTailwindClassNames={"rounded-l-full max-sm:rounded-full"}
        />
        <SearchButton className="sm:hidden" />
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
          options={modelOptions}
          onChange={setModel}
          selected={model || modelQuery || ""}
        />
        <SearchButton className="sm:hidden" />
      </div>
      <SearchButton className="max-sm:hidden" />
    </form>
  );
};
