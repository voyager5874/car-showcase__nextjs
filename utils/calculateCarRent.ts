export const calculateCarRent = (city_mpg: number, year: number | string) => {
  const currentYear = new Date().getFullYear();
  if (isNaN(Number(year)) || Number(year) > currentYear) {
    throw new Error("Invalid year");
  }
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (currentYear - Number(year)) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};
