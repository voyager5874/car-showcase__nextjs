import { CarType } from "@/types";
import {
  WikiSearchResponse,
  WikiSearchResponseItem,
  WikiPageMediaResponseItem,
} from "@/services/wikimedia-api/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

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
    const res: WikiSearchResponse = await fetch(requestUrl).then((res) =>
      res.json()
    );
    console.log("wiki search result", res);
    return res.pages;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getImagesFromWikiPage = async (
  car: CarType
): Promise<string[]> => {
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
    const res: { items: WikiPageMediaResponseItem[] } = await fetch(
      requestUrl
    ).then((res) => res.json());
    console.log("page/media-list/TITLE response", res);
    const images = res?.items?.length
      ? filterWikiMediaListResults(res.items, car).map(
          (item) => `https:${item.srcset[0].src}`
        )
      : [];

    console.log("getImagesFromWikiPage: ", images);
    // if (!images.length) return "/default-car.png";
    if (!images?.length) return [];
    return images;
  } catch (err) {
    console.log("getCarImageFromWiki / catch", getErrorMessage(err));
    return [];
  }
};

export const findWikimediaImagesKeys = async (car: CarType) => {
  const { make, model, year } = car;
  // const url = new URL(`https://api.wikimedia.org/core/v1/commons/search/title`);
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/wiki-commons`);
  url.searchParams.append("car", `${make} ${model} ${year}`);
  const requestUrl = url.toString();
  try {
    const res: WikiSearchResponse = await fetch(requestUrl).then((res) =>
      res.json()
    );

    console.log("wiki commons search json", res);
    if (!res?.pages?.length) {
      throw new Error("nothing found");
    }
    const files = res.pages.filter((item) =>
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
    const res = await fetch(requestUrl).then((res) => res.json());
    return res?.link;
  } catch (err) {
    // return "/car-image-err.png";
    return null;
  }
};

export const getImagesFromWikiCommons = async (
  car: CarType
): Promise<string[]> => {
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
    if (!links.length) return [];
    return links;
  } catch (err) {
    console.log(getErrorMessage(err));
    return [];
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
  // return data[0];
}

function filterWikiMediaListResults(
  data: WikiPageMediaResponseItem[],
  car: CarType
) {
  const { make, model, year } = car;
  const modelWithoutShortWords = model.replace(" 2wd", "").replace(" fwd", "");

  const modelWords = modelWithoutShortWords.split(" ");

  const items = data.filter(
    (item) =>
      (!modelWithoutShortWords.includes("wagon")
        ? !item.title.toLowerCase().includes("wagon")
        : true) &&
      (!modelWithoutShortWords.includes("convertible")
        ? !item.title.toLowerCase().includes("convertible")
        : true) &&
      (!modelWithoutShortWords.includes("roadster")
        ? !item.title.toLowerCase().includes("roadster")
        : true) &&
      (!modelWithoutShortWords.includes("cabriolet")
        ? !item.title.toLowerCase().includes("cabriolet")
        : true) &&
      (!modelWithoutShortWords.includes("coupe")
        ? !item.title.toLowerCase().includes("coupe")
        : true) &&
      item.type === "image" &&
      item.title.toLowerCase().includes(make) &&
      item.title.includes(`${year}`) &&
      modelWords.every((word) => item.title.toLowerCase().includes(word))
  );
  console.log("filter Wiki MediaList Results", items);
  return items;
}

function filterWikiSearchResults(data: WikiSearchResponseItem[], car: CarType) {
  const { make, model, year } = car;
  const modelWithoutShorWords = model.replace(" 2wd", "").replace(" fwd", "");

  const modelWords = modelWithoutShorWords.split(" ");

  const items = data.filter(
    (item) =>
      (!modelWithoutShorWords.includes("wagon")
        ? !item.title.toLowerCase().includes("wagon")
        : true) &&
      (!modelWithoutShorWords.includes("convertible")
        ? !item.title.toLowerCase().includes("convertible")
        : true) &&
      (!modelWithoutShorWords.includes("roadster")
        ? !item.title.toLowerCase().includes("roadster")
        : true) &&
      (!modelWithoutShorWords.includes("cabriolet")
        ? !item.title.toLowerCase().includes("cabriolet")
        : true) &&
      (!modelWithoutShorWords.includes("coupe")
        ? !item.title.toLowerCase().includes("coupe")
        : true) &&
      (item.title.toLowerCase().includes(".jpg") ||
        item.title.toLowerCase().includes(".png")) &&
      item.title.toLowerCase().includes(make) &&
      item.title.includes(`${year}`) &&
      //mazda has too simple models name: 3, 6 etc.
      !item.title.toLowerCase().includes("zoom-zoom") &&
      !item.title.toLowerCase().includes("office") &&
      !item.title.toLowerCase().includes("engine") &&
      !item.title.toLowerCase().includes("temporary") &&
      modelWords.every((word) => item.title.toLowerCase().includes(word))
  );
  console.log("filterWikiSearchResults output", items);
  return items;
}
