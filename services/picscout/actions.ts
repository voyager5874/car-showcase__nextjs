import { CarType } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { removeBetweenBracketsText } from "@/utils/stringUtilities";

type PicScoutResponseItem = {
  url: string;
  width: number;
  height: number;
};
type SearchEnginName = "google" | "bing" | "duckduckgo";
export const scrapeImages = async (
  car: CarType,
  engine: SearchEnginName = "bing"
) => {
  const { make, model, year } = car;
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/picscout/${engine}`
  );
  url.searchParams.append(
    "query",
    `${make}+${removeBetweenBracketsText(model)}+${year}`
  );
  const requestUrl = url.toString();

  try {
    const res = await fetch(requestUrl).then((res) => res.json());
    console.log("picScout scrape json", res);
    if (!res?.items?.length) return [];
    const images = await filterResults(res.items, car);
    if (!images.length) return [];
    return images;
  } catch (err) {
    console.log(getErrorMessage(err));
    return [];
  }
};

// causes CORS error

// export const scrapeImagesFromWebSearchClientside = async (
//   car: CarType,
//   engine: SearchEnginName = "bing"
// ) => {
//   const { make, model, year } = car;
//   // url.searchParams.append(
//   //   "query",
//   //   `${make}+${removeBetweenBrackets(model)}+${year}`
//   // );
//   const query = `${make}+${removeBetweenBracketsText(model)}+${year}`;
//   const searchSettings = new URLSearchParams();
//   if (engine === "google") {
//     searchSettings.append("imgType", "photo");
//     searchSettings.append("imgColorType", "color");
//     searchSettings.append("exactTerms", query);
//   }
//   if (engine === "bing") {
//     // doesn't seem to make any difference
//     searchSettings.append("count", "150");
//     searchSettings.append("imageType", "Photo");
//     searchSettings.append("minHeight", "300");
//     searchSettings.append("color", "Monochrome");
//   }
//   try {
//     const res = await PicScout.search(query, {
//       engine: engine,
//       additionalQueryParams: searchSettings,
//     });
//     console.log("picScout scrape json", res);
//     if (!res?.length) return [];
//     const images = await filterResults(res, car);
//     if (!images.length) return [];
//     return images;
//   } catch (err) {
//     console.log(getErrorMessage(err));
//     return [];
//   }
// };

async function filterResults(data: PicScoutResponseItem[], car: CarType) {
  const { make, model, year } = car;
  const modelWithoutShorWords = model.replace(" 2wd", "").replace(" fwd", "");
  const modelWords = removeBetweenBracketsText(modelWithoutShorWords).split(
    " "
  );
  // todo: having modelName and modelName + "sport" atc. filter for the first car should use !model.includes("sport")
  // somehow "outlander sport" yields more results than just "outlander"
  const relevant = data.filter(
    (item) =>
      (!modelWithoutShorWords.includes("wagon")
        ? !item.url.toLowerCase().includes("wagon")
        : true) &&
      (!modelWithoutShorWords.includes("convertible")
        ? !item.url.toLowerCase().includes("convertible")
        : true) &&
      (!modelWithoutShorWords.includes("roadster")
        ? !item.url.toLowerCase().includes("roadster")
        : true) &&
      (!modelWithoutShorWords.includes("cabriolet")
        ? !item.url.toLowerCase().includes("cabriolet")
        : true) &&
      (!modelWithoutShorWords.includes("coupe")
        ? !item.url.toLowerCase().includes("coupe")
        : true) &&
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

// probably faster to use as image src and change to some other link within onError callback
export async function isValidImageUrl(url: string) {
  return new Promise((resolve) => {
    resolve(true);
    // const image = new Image();
    // image.onload = () => resolve(true);
    // image.onerror = () => resolve(false);
    // image.src = url;
  });
}

// todo add some opt in / opt out element (checkbox), create simple backend
// in case of deployment to vercel
