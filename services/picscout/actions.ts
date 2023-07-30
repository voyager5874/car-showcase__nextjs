import { CarType } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

type PicScoutResponseItem = {
  url: string;
  width: number;
  height: number;
};
type SearchEnginName = "google" | "bing" | "duckduckgo";
export const findImages = async (
  car: CarType,
  angle?: number,
  engine: SearchEnginName = "bing"
) => {
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
    console.log("picScout scrape json", json);
    let images = [] as string[];
    if (json?.items?.length) {
      images = await filterResults(json.items, car);
    }

    if (!images.length) images.push("/default-car.png");
    return images;
  } catch (err) {
    console.log(getErrorMessage(err));
    return ["/car-image-err.png"];
  }
};

async function filterResults(data: PicScoutResponseItem[], car: CarType) {
  const { make, model, year } = car;
  const modelWithoutShorWords = model.replace(" 2wd", "");
  const modelWords = removeBetweenBrackets(modelWithoutShorWords).split(" ");
  // todo: having modelName and modelName + "sport" atc. filter for the first car should use !model.includes("sport")
  // somehow "outlander sport" yields more results than just "outlander"
  const relevant = data.filter(
    (item) =>
      item.url.toLowerCase().includes(make) &&
      item.url.includes(`${year}`) &&
      !item.url.toLowerCase().includes("pnzdrive") &&
      !item.url.toLowerCase().includes("priceinsouthafrica.com") &&
      !item.url.toLowerCase().includes("mcarsstatic.cachefly.net") &&
      !item.url.toLowerCase().includes("4.bp.blogspot.com") &&
      !item.url.toLowerCase().includes("netcarshow.com") &&
      !item.url.toLowerCase().includes("diagram") &&
      !item.url.toLowerCase().includes("temporary") &&
      modelWords.every((word) => item.url.toLowerCase().includes(word))
  );

  const validUrls = [] as string[];

  for (let image of relevant) {
    const isValid = await isValidImageUrl(image.url);
    if (isValid) {
      validUrls.push(image.url);
    }
  }
  console.log("picScout model filter", modelWords);
  console.log("picScout Filter output", validUrls);
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
