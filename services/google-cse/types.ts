export interface GoogleResponse {
  kind: string;
  url: Url;
  queries: Queries;
  context: Context;
  searchInformation: SearchInformation;
  items?: GoggleResponseItem[];
}

export interface GoggleResponseItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  mime: string;
  fileFormat: string;
  image: Image;
}

interface Image {
  contextLink: string;
  height: number;
  width: number;
  byteSize: number;
  thumbnailLink: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
}

interface SearchInformation {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
}

interface Context {
  title: string;
}

interface Queries {
  request: Request[];
  nextPage?: Request[];
  previousPage?: Request[];
}

interface Request {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  exactTerms: string;
  searchType: string;
  imgSize: string;
  imgType: string;
}

interface Url {
  type: string;
  template: string;
}

export interface GoogleErrorResponse {
  error: Error2;
}

interface Error2 {
  code: number;
  message: string;
  errors: Error[];
  status: string;
  details: Detail[];
}

interface Detail {
  "@type": string;
  reason?: string;
  domain?: string;
  metadata?: Metadata;
  links?: Link[];
}

interface Link {
  description: string;
  url: string;
}

interface Metadata {
  quota_location: string;
  service: string;
  quota_limit: string;
  quota_limit_value: string;
  quota_metric: string;
  consumer: string;
}

interface Error {
  message: string;
  domain: string;
  reason: string;
}

export function isGoogleErrorResponse(data: any): data is GoogleErrorResponse {
  return (
    data != null &&
    typeof data.error === "object" &&
    data.error.code != null &&
    typeof data.error.message === "string"
  );
}

export function isGoogleResponse(data: any): data is GoogleResponse {
  return data != null && data?.kind && data?.searchInformation;
}

// export type GoggleResponseItem = {
//   displayLink: string;
//   fileFormat: "image/png";
//   htmlSnippet: string;
//   htmlTitle: string;
//   image: {
//     byteSize: number;
//     contextLink: string;
//     height: number;
//     thumbnailHeight: number;
//     thumbnailLink: string;
//     thumbnailWidth: number;
//     width: number;
//   };
//   kind: "customsearch#result";
//   link: string;
//   mime: "image/png";
//   snippet: string;
//   title: string;
// };
