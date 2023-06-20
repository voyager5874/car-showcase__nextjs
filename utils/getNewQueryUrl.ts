export const getNewQueryUrl = (model: string, manufacturer: string) => {
  // Create a new URLSearchParams object using the current URL search parameters
  const searchParams = new URLSearchParams(window.location.search);

  // Update or delete the 'model' search parameter based on the 'model' value
  if (model) {
    searchParams.set("model", model);
  } else {
    searchParams.delete("model");
  }

  // Update or delete the 'manufacturer' search parameter based on the 'manufacturer' value
  if (manufacturer) {
    searchParams.set("make", manufacturer);
  } else {
    searchParams.delete("make");
  }

  // Generate the new pathname with the updated search parameters
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};
