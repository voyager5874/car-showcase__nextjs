"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { scrollToCatalogue } from "@/utils/scrollToCatalogue";

const handleScroll = () => {
  scrollToCatalogue("smooth");
};
export const Hero = () => {
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Find, book, rent a car—quick and super easy!
        </h1>

        <p className="hero__subtitle">
          Streamline your car rental experience with our effortless booking
          process.
        </p>

        <Button
          title="Explore Cars"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image
            src="/hero.png"
            alt="hero"
            fill
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 50vw"
          />
        </div>

        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};
