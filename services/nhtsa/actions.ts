import { GetModelsForMakeResponse } from "@/services/nhtsa/types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const getModelsForMake = async (manufacturer: string) => {
  try {
    const res: GetModelsForMakeResponse = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${manufacturer}?format=json`
    ).then((res) => res.json());
    console.log("models", res.Results);
    const optionsWithId = res.Results.map((item) => ({
      id: item.Model_ID,
      name: item.Model_Name,
    }));
    const options = res.Results.map((item) => item.Model_Name);
    console.log(options);
    return options;
  } catch (err) {
    console.log(getErrorMessage(err));
    return [];
  }
};
