"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Listbox, Transition } from "@headlessui/react";
import { updateSearchParams } from "@/utils/updateSearchParams";
import type { FilterOptionType } from "@/types";

type PropsType = {
  title: string;
  options: FilterOptionType[];
};

export function Filter({ title, options }: PropsType) {
  const router = useRouter();
  const params = useSearchParams();

  const [selected, setSelected] = useState(options[0]); // State for storing the selected option

  // update the URL search parameters and navigate to the new URL
  const handleUpdateParams = (e: { title: string; value: string }) => {
    // const newPathName = updateSearchParams(title, e.value.toLowerCase());
    const newPathName = updateSearchParams({ [title]: e.value.toLowerCase() });

    router.push(newPathName, { scroll: false });
  };

  const handleOptionChange = (e: FilterOptionType) => {
    setSelected(e); // Update the selected option in state
    handleUpdateParams(e); // Update the URL search parameters and navigate to the new URL
  };

  useEffect(() => {
    console.log({ title });
    const filterQuery = params.get(title);
    console.log({ filterQuery });
    if (!filterQuery) return;
    const option = options.find((o) => o.value.toLowerCase() === filterQuery);
    console.log({ option });
    if (option) setSelected(option);
  }, []);

  return (
    <div className="w-fit">
      <Listbox value={selected} onChange={handleOptionChange}>
        <div className="relative w-fit z-10">
          {/* Button for the listbox */}
          <Listbox.Button className="custom-filter__btn">
            <span className="block truncate">{selected.title}</span>
            <Image
              src="/chevron-up-down.svg"
              width={20}
              height={20}
              className="ml-4 object-contain"
              alt="chevron_up-down"
            />
          </Listbox.Button>
          {/* Transition for displaying the options */}
          <Transition
            as={Fragment} // group multiple elements without introducing an additional DOM node i.e., <></>
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="custom-filter__options">
              {/* Map over the options and display them as listbox options */}
              {options?.map((option) => (
                <Listbox.Option
                  key={option.title}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? "bg-primary-blue text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.title}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
