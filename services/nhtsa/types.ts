export interface GetModelsForMakeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Result[];
}

interface Result {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}
