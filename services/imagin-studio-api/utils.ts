import { CarType } from "@/types";

export const generateCarImageUrl = (car: CarType, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append(
    "customer",
    // process.env.IMAGINSTUDIO_API_KEY ||
    process.env.NEXT_PUBLIC_API_URL_IMAGINSTUDIO_API_KEY!
  );

  url.searchParams.append("make", make);
  if (angle) url.searchParams.append("angle", `${angle}`);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  // url.searchParams.append('zoomLevel', zoomLevel);
  return url.toString();
  // return "/hero.png";
};
