import { CarType } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { GoggleResponseItem } from "@/services/google-cse/types";

export const findImageWithGoogle = async (car: CarType) => {
  const { make, model, year } = car;
  const url = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/google-image-search`
  );
  url.searchParams.append("car", `${make}+${model}+${year}`);
  url.searchParams.append("startIndex", `${1}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl).then((res) => res.json());
    console.log(`google gse result for ${make} ${model} ${year}`, res);
    const images = res?.images?.length
      ? filterResults(res.images, car)?.map(
          (item: GoggleResponseItem) => item?.link
        )
      : [];

    // if (!images.length) return "/default-car.png";
    if (!images.length) return [];
    return images;
  } catch (err) {
    console.log(getErrorMessage(err));
    return ["/car-image-err.png"];
  }
};

function filterResults(data: GoggleResponseItem[], car: CarType) {
  const { make, model, year } = car;
  const modelWithoutShorWords = model.replace(" 2wd", "").replace(" fwd", "");

  const modelWords = modelWithoutShorWords.split(" ");

  return data.filter(
    (item: GoggleResponseItem) =>
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
      item.title.toLowerCase().includes(make) &&
      (item.title.includes(`${year}`) ||
        item.image.contextLink.includes(`${year}`)) &&
      // item.image.contextLink.includes(`${modelWords[0]}`) &&
      modelWords.every((word) =>
        item.image.contextLink.toLowerCase().includes(word)
      )
  );
}
