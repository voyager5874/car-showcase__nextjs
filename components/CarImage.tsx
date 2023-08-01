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
  onImageError?: (item: string | number) => void;
  tailwindClasses?: string;
};

export const CarImage = ({
  angle,
  car,
  images,
  tailwindClasses,
  onImageError,
}: Props) => {
  const [imageUrl, setImageUrl] = useState("/default-car.png");

  useEffect(() => {
    console.log("CarImages useEffect / images list", images);
    if (!images.length) return;
    if (
      images.length === 1 &&
      !images[0].includes("default-car.png") &&
      !images[0].includes("car-image-err.png")
    ) {
      console.log("CarImage useEffect length=1 images[0]", images[0]);
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
    if (!images.length) {
      console.error("car image error", imageUrl);
      setImageUrl("/car-image-err.png");
      return;
    }
    const cleanedImages = images.filter((url) => url !== imageUrl);
    const image = getAnotherItemFromArray(
      cleanedImages,
      Number(car.city_mpg) + Number(car.highway_mpg)
    );
    onImageError && onImageError(imageUrl);
    setImageUrl(image);
  };

  return (
    <>
      <Image
        unoptimized
        src={imageUrl}
        onError={handleImageError}
        alt="car model"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={`object-contain ${tailwindClasses || ""} ${
          imageUrl === "/car-image-err.png" || imageUrl === "/default-car.png"
            ? "object-bottom"
            : "object-top"
        }`}
      />
    </>
  );
};
