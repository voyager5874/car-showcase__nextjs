export type CarType = {
  city_mpg: number;
  class: string;
  combination_mpg: number;
  cylinders: number;
  displacement: number;
  drive: string;
  fuel_type: string;
  highway_mpg: number;
  make: string;
  model: string;
  transmission: string;
  year: number;
};

export type SearchParamsType = Partial<CarType> & { limit?: number };

// https://api-ninjas.com/api/cars

// make (optional) - vehicle manufacturer (e.g. audi or toyota).
// model (optional) - vehicle manufacturer (e.g. a4 or corolla).
// fuel_type (optional) - type of fuel used. Possible values: gas, diesel, electricity.
// drive (optional) - drive transmission. Possible values: fwd (front-wheel drive), rwd (rear-wheel drive), awd (all-wheel drive), 4wd (four-wheel drive).
// cylinders (optional) - number of cylinders in engine. Possible values: 2, 3 4, 5, 6, 8, 10, 12, 16.
// transmission (optional) - type of transmission. Possible values: manual, automatic.
// year (optional) - vehicle model year (e.g. 2018).
// min_city_mpg (optional) - minimum city fuel consumption (in miles per gallon).
// max_city_mpg (optional) - maximum city fuel consumption (in miles per gallon).
// min_hwy_mpg (optional) - minimum highway fuel consumption (in miles per gallon).
// max_hwy_mpg (optional) - maximum highway fuel consumption (in miles per gallon).
// min_comb_mpg (optional) - minimum combination (city and highway) fuel consumption (in miles per gallon).
// max_comb_mpg (optional) - maximum combination (city and highway) fuel consumption (in miles per gallon).

export type FilterOptionType = {
  title: string;
  value: string;
};
