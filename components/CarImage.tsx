"use client";

import { useEffect, useState } from "react";
import { getCarImage } from "@/services/imagin-studio-api/actions";
import Image from "next/image";
import { CarType } from "@/types";
import { getOldCarImage } from "@/services/google-search/actions";

type Props = {
  angle?: number;
  car: CarType;
};

export const CarImage = ({ angle, car }: Props) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const image =
        Number(car.year) < 2015
          ? await getOldCarImage(car, angle)
          : await getCarImage(car, angle);

      setImageUrl(image);
    };
    fetch().then((_) => {});
  }, []);

  const handleImageError = () => {
    setImageUrl("/default-car.png");
  };

  return (
    <>
      <Image
        src={imageUrl || "/default-car.png"}
        onError={handleImageError}
        alt="car model"
        fill
        priority
        className="object-contain"
      />
    </>
  );
};
