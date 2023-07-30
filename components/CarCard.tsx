"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CarType } from "@/types";
import { Button } from "./Button";
import { CarDetails } from "./CarDetails";
import { calculateCarRent } from "@/utils";
import { CarImage } from "@/components/CarImage";
import { findImages } from "@/services/picscout/actions";
import { getCarImagesList } from "@/services/imagin-studio-api/actions";
import { getImagesFromWikiCommons } from "@/services/wikimedia-api/actions";

type PropsType = {
  car: CarType;
};

export const CarCard = ({ car }: PropsType) => {
  const { city_mpg, year, make, model, transmission, drive } = car;

  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>(["/default-car.png"]);

  const carRent = calculateCarRent(city_mpg, year);

  useEffect(() => {
    const fetch = async () => {
      let finalList: string[];
      const links =
        Number(car.year) < 2022
          ? await getImagesFromWikiCommons(car)
          : await getCarImagesList(car);
      finalList = [...links];
      if (links.length < 4) {
        const scraped = await findImages(car);
        if (scraped.length && scraped[0] !== "/car-image-err.png") {
          finalList = [...finalList, ...scraped];
        }
      }
      setImages(finalList);
    };
    fetch().then((_) => {});
  }, [car.model, car.year, car.make]);
  return (
    <div className="flex flex-col p-6 justify-center items-start text-black-100 bg-primary-blue-100 hover:bg-white hover:shadow-md rounded-3xl group">
      <div className="w-full flex justify-between items-start gap-2">
        <h2 className="text-[22px] leading-[26px] font-bold capitalize">
          {make} {model}
        </h2>
        <h5 className="text-xs">{year}</h5>
      </div>

      <p className="flex mt-6 text-[32px] leading-[38px] font-extrabold">
        <span className="self-start text-[14px] leading-[17px] font-semibold">
          $
        </span>
        {carRent}
        <span className="self-end text-[14px] leading-[17px] font-medium">
          /day
        </span>
      </p>

      <div className="relative w-full h-40 my-3 object-contain">
        <CarImage car={car} images={images} />
      </div>

      <div className="relative flex w-full mt-2">
        <div className="flex group-hover:invisible w-full justify-between text-grey">
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/steering-wheel.svg"
              width={20}
              height={20}
              alt="steering wheel"
            />
            <p className="text-[14px] leading-[17px]">
              {transmission === "a" ? "Automatic" : "Manual"}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/tire.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">
              {drive && drive?.toUpperCase()}
            </p>
          </div>
          <div className="car-card__icon">
            <Image src="/gas.svg" width={20} height={20} alt="seat" />
            <p className="car-card__icon-text">{city_mpg} MPG</p>
          </div>
        </div>

        <div className="hidden group-hover:flex absolute bottom-0 w-full z-10">
          <Button
            title="View More"
            containerStyles="w-full py-[16px] rounded-full bg-primary-blue"
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            rightIcon="/right-arrow.svg"
            handleClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      {isOpen && (
        <CarDetails
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          car={car}
          images={images}
        />
      )}
    </div>
  );
};
