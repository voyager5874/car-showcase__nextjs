import { CarType } from "@/types";
import { getAnotherItemFromArray } from "@/utils/getAnotherItemFromArray";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const findImages = async (car: CarType, angle?: number) => {
  const { make, model, year } = car;
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/scrape-google`);
  url.searchParams.append("query", `${make}+${model}+${year}`);
  const requestUrl = url.toString();

  try {
    const res = await fetch(requestUrl);
    const json = await res.json();
    console.log("google scrape json", json);
    const images = json?.items?.length
      ? filterResults(json.items, car)?.map(
          (item: PicScoutResponseItem) => item?.url
        )
      : [];

    console.log({ images });

    // if (!images.length) return "/default-car.png";
    if (!images.length) return "/car-image-err.png";
    return angle ? getAnotherItemFromArray(images, angle) : images[0];
  } catch (err) {
    console.log(getErrorMessage(err));
    return "/car-image-err.png";
  }
};

function filterResults(data: PicScoutResponseItem[], car: CarType) {
  const { make, model, year } = car;
  const modelWords = model.split(" ");

  return data.filter(
    (item) =>
      item.url.toLowerCase().includes(make) &&
      item.url.includes(`${year}`) &&
      modelWords.every((word) => item.url.toLowerCase().includes(word))
  );
}

type PicScoutResponseItem = {
  url: string;
  width: number;
  height: number;
};
