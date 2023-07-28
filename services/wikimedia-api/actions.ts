import { CarType } from "@/types";
import {
  WikiSearchResponse,
  WikiSearchResponseItem,
  WikiPageMediaResponseItem,
} from "@/services/wikimedia-api/types";
import { getAnotherItemFromArray } from "@/utils/getAnotherItemFromArray";

export const findWikiPages = async (
  car: CarType
): Promise<WikiSearchResponseItem[] | []> => {
  const { make, model } = car;
  const modelWords = model.split(" ");

  const url = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/wiki-pages-search`
  );
  url.searchParams.append("car", `${make} ${modelWords[0]}`);
  url.searchParams.append("model", `${model}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);
    const json: WikiSearchResponse = await res.json();
    console.log("wiki search result", json);
    return json.pages;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getImagesFromWikiPage = async (car: CarType, angle?: number) => {
  try {
    const pages = await findWikiPages(car);
    console.log("findWikiPageTitles", pages);
    if (!pages?.length) throw new Error("no pages found");
    console.log("getImagesFromWikiPage pages", pages);

    const page = selectWikiArticle(pages, car);
    if (!page) throw new Error("no page found");
    const url = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/wiki-page-media/${page.key}`
    );

    const requestUrl = url.toString();
    const res = await fetch(requestUrl);
    const json: { items: WikiPageMediaResponseItem[] | [] } = await res.json();
    console.log("wiki car images client request json", json);
    const images = json?.items?.length
      ? filterWikiMediaListResults(json.items, car).map(
          (item) => `https:${item.srcset[0].src}`
        )
      : [];
    if (images?.length) {
      console.log(images);
      // if (!images.length) return "/default-car.png";
      if (!images?.length) return "/car-image-err.png";
      return angle ? getAnotherItemFromArray(images, angle) : images[0];
    } else {
      console.log("wiki client request: item not found");
      return "/car-image-err.png";
    }
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "failed to get a car image from wikipedia";
    console.log("getCarImageFromWiki / catch", message);

    return "/car-image-err.png";
  }
};

export const findWikimediaImagesKeys = async (car: CarType) => {
  const { make, model, year } = car;
  // const url = new URL(`https://api.wikimedia.org/core/v1/commons/search/title`);
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/wiki-commons`);
  url.searchParams.append("car", `${make} ${model} ${year}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);

    const json: WikiSearchResponse = await res.json();
    console.log("wiki commons search json", json);
    if (!json?.pages?.length) {
      throw new Error("nothing found");
    }
    const files = json.pages.filter((item) =>
      item.title.toLowerCase().includes("file")
    );
    console.log("wiki files", files);
    const imagesKeys = files.length
      ? filterWikiSearchResults(files, car).map((item) => item?.key)
      : [];
    console.log("imagesKeys", imagesKeys);
    return imagesKeys;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getWikimediaFileLink = async (fileKey: string) => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/wiki-commons/${fileKey}`
  );
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);
    const json = await res.json();
    return json?.link;
  } catch (err) {
    return "/car-image-err.png";
  }
};

export const getImagesFromWikiCommons = async (
  car: CarType,
  angle?: number
): Promise<string> => {
  try {
    const filesKeys = await findWikimediaImagesKeys(car);
    console.log("filesKeys", filesKeys);
    if (!filesKeys.length) {
      throw new Error("no file keys!");
    }
    const links = [];
    for (let i = 0; i <= filesKeys.length; i++) {
      if (filesKeys[i]) {
        const link = await getWikimediaFileLink(filesKeys[i]);
        if (link) links.push(link);
      }
    }
    console.log("wiki commons request links", links);
    if (!links.length) return "/car-image-err.png";
    return angle ? getAnotherItemFromArray(links, angle) : links[0];
  } catch (err) {
    return "/car-image-err.png";
  }
};

export function selectWikiArticle(
  data: WikiSearchResponseItem[],
  car: CarType
) {
  const { make, model } = car;
  const modelWords = model.split(" ");
  return data.find(
    (item) =>
      item.title.toLowerCase().includes(`${make}`) &&
      item.title.toLowerCase().includes(`${modelWords[0]}`)
    // modelWords.every((word) => item.image.contextLink.includes(word))
  );
}

function filterWikiMediaListResults(
  data: WikiPageMediaResponseItem[],
  car: CarType
) {
  const { make, model, year } = car;
  const modelWords = model.split(" ");

  return data.filter(
    (item) =>
      item.type === "image" &&
      item.title.toLowerCase().includes(make) &&
      item.title.includes(`${year}`) &&
      modelWords.every((word) => item.title.toLowerCase().includes(word))
  );
}

function filterWikiSearchResults(data: WikiSearchResponseItem[], car: CarType) {
  const { make, model, year } = car;
  const modelWords = model.split(" ");

  return data.filter(
    (item) =>
      (item.title.toLowerCase().includes(".jpg") ||
        item.title.toLowerCase().includes(".png")) &&
      item.title.toLowerCase().includes(make) &&
      item.title.includes(`${year}`) &&
      //mazda has too simple models name: 3, 6 etc.
      !item.title.toLowerCase().includes("zoom-zoom") &&
      !item.title.toLowerCase().includes("office") &&
      modelWords.every((word) => item.title.toLowerCase().includes(word))
  );
}
