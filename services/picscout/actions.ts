import { CarType } from "@/types";
import { getAnotherItemFromArray } from "@/utils/getAnotherItemFromArray";
import { getErrorMessage } from "@/utils/getErrorMessage";

type PicScoutResponseItem = {
  url: string;
  width: number;
  height: number;
};

const engine: "google" | "bing" | "duckduckgo" = "bing";
export const findImages = async (car: CarType, angle?: number) => {
  const { make, model, year } = car;
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/picscout/${engine}`
  );
  url.searchParams.append(
    "query",
    `${make}+${removeBetweenBrackets(model)}+${year}`
  );
  const requestUrl = url.toString();

  try {
    const res = await fetch(requestUrl);
    const json = await res.json();
    console.log("google scrape json", json);
    let images = [] as string[];
    if (json?.items?.length) {
      images = await filterResults(json.items, car);
    }

    console.log({ images });

    // if (!images.length) return "/default-car.png";
    if (!images.length) return "/car-image-err.png";
    return angle ? getAnotherItemFromArray(images, angle) : images[0];
  } catch (err) {
    console.log(getErrorMessage(err));
    return "/car-image-err.png";
  }
};

async function filterResults(data: PicScoutResponseItem[], car: CarType) {
  const { make, model, year } = car;

  const modelWords = removeBetweenBrackets(model).split(" ");

  const relevant = data.filter(
    (item) =>
      item.url.toLowerCase().includes(make) &&
      item.url.includes(`${year}`) &&
      !item.url.toLowerCase().includes("pnzdrive") &&
      modelWords.every((word) => item.url.toLowerCase().includes(word))
  );

  const validUrls = [] as string[];

  for (let image of relevant) {
    const isValid = await isValidImageUrl(image.url);
    if (isValid) {
      validUrls.push(image.url);
    }
  }

  return validUrls;
}

function removeBetweenBrackets(str: string) {
  let startIndex = str.indexOf("(");
  if (startIndex !== -1) {
    let endIndex = str.indexOf(")", startIndex);
    if (endIndex !== -1) {
      return str.slice(0, startIndex) + str.slice(endIndex + 1);
    }
  }
  return str;
}

export async function isValidImageUrl(url: string) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}
