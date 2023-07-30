import Image from "next/image";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

type OptionWithId = {
  id: string | number;
  name: string;
};

type PropsType = {
  allowCustomValues: boolean;
  selected: string | null;
  options: string[] | undefined;
  optionsWithId?: OptionWithId[];
  onChange: (option: string) => void;
  inputTailwindClassNames?: string;
};
export const SearchableOptions = ({
  allowCustomValues,
  selected,
  onChange,
  options,
  inputTailwindClassNames,
}: PropsType) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options?.filter((item) =>
          item
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="flex-1 max-sm:w-full flex justify-start items-center">
      <Combobox value={selected} onChange={onChange} nullable>
        <div className="relative w-full">
          <Combobox.Button className="absolute top-[14px]">
            <Image
              src="/car-logo.svg"
              width={20}
              height={20}
              className="ml-4"
              alt="car logo"
            />
          </Combobox.Button>

          <Combobox.Input
            className={`w-full h-[48px] pl-12 p-4 max-sm:rounded-full bg-light-white outline-none cursor-pointer text-sm ${inputTailwindClassNames}`}
            displayValue={(item: string) => item}
            onChange={(event) => setQuery(event.target.value)} // Update the search query when the input changes
            placeholder={selected ? undefined : "choose..."}
            defaultValue={selected && selected}
          />

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")} // Reset the search query after the transition completes
          >
            <Combobox.Options
              className={`z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base 
              shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
              static
            >
              {allowCustomValues &&
              filteredOptions?.length === 0 &&
              query.length >= 2 ? (
                <Combobox.Option
                  value={query}
                  className={({ active }) =>
                    `relative search-manufacturer__option font-bold ${
                      active ? "bg-primary-blue text-white" : "text-gray-900"
                    }`
                  }
                >
                  {`Create ${query}`}
                </Combobox.Option>
              ) : (
                filteredOptions?.map((item) => (
                  <Combobox.Option
                    key={item}
                    className={({ active }) =>
                      `relative search-manufacturer__option ${
                        active ? "bg-primary-blue text-white" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            active ? "font-bold" : "font-normal"
                          }`}
                        >
                          {item}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
