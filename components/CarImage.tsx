"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CarType } from "@/types";
import { getAnotherItemFromArray } from "@/utils/getAnotherItemFromArray";
import { IMAGIN_STUDIO_API_YEAR } from "@/constants/app-settings";

type Props = {
  angle?: number;
  car: CarType;
  images: string[];
  tailwindClasses?: string;
};

export const CarImage = ({ angle, car, images, tailwindClasses }: Props) => {
  const [imageUrl, setImageUrl] = useState("/default-car.png");

  useEffect(() => {
    if (!images.length) return;
    if (images.length === 1 && images[0] !== "/default-car.png") {
      setImageUrl(images[0]);
      return;
    }
    let image = "";
    if (images.length >= 4 && Number(car.year) >= IMAGIN_STUDIO_API_YEAR) {
      if (!angle) {
        image = images[0];
      }
      if (angle === 29) {
        image = images[1];
      }
      if (angle === 33) {
        image = images[2];
      }
      if (angle === 13) {
        image = images[3];
      }
      setImageUrl(image);
      return;
    }
    // this is just to make similar cars to have different images
    image = angle
      ? getAnotherItemFromArray(
          images,
          angle,
          Number(car.city_mpg) + Number(car.highway_mpg)
        )
      : getAnotherItemFromArray(
          images,
          Number(car.city_mpg) + Number(car.highway_mpg)
        );
    setImageUrl(image);
  }, [images.length, angle, car.city_mpg, car.highway_mpg, car.year]);

  const handleImageError = () => {
    setImageUrl("/car-image-err.png");
  };

  return (
    <>
      <Image
        src={imageUrl || "/default-car.png"}
        onError={handleImageError}
        alt="car model"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={`object-contain ${tailwindClasses || ""}`}
      />
    </>
  );
};
