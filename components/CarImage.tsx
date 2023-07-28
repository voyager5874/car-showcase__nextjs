"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CarType } from "@/types";
import { findImages } from "@/services/google-scraper/actions";

type Props = {
  angle?: number;
  car: CarType;
};

export const CarImage = ({ angle, car }: Props) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const image = await findImages(car, angle);
      setImageUrl(image);
    };
    fetch().then((_) => {});
  }, [car, angle]);

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
