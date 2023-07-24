import { CarType } from "@/types";

export const getOldCarImage = async (car: CarType, angle?: number) => {
  const { make, model, year } = car;
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/old-car-image`);
  url.searchParams.append("car", `${make} ${model} ${year}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);
    const json = await res.json();
    console.log("old car google request result", json);
    const images = json?.images?.length
      ? json?.images.map((item: { link: string }) => item?.link)
      : [];
    if (!images.length) return "/car-image-err.png";

    return angle ? images[getRandomInt(images.length)] : images[0];
  } catch (err) {
    console.log(err);
    const message =
      err instanceof Error ? err.message : "failed to get a car image";
    throw new Error(message);
  }
};

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}
