import { CarType } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const getCarImage = async (car: CarType, angle?: number) => {
  const { make, model, year } = car;
  const url = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/car-image`);
  url.searchParams.append("make", make);
  if (angle) url.searchParams.append("angle", `${angle}`);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("modelYear", `${year}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.log(getErrorMessage(err));
    return "/car-image-err.png";
  }
};

export const getCarImagesList = async (car: CarType) => {
  try {
    return await Promise.all([
      getCarImage(car),
      getCarImage(car, 29), //front
      getCarImage(car, 33), //top
      getCarImage(car, 13), //rear
    ]);
  } catch (err) {
    console.log(getErrorMessage(err));
    return ["/car-image-err.png"];
  }
};
