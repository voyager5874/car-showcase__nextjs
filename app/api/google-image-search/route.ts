import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  GoogleErrorResponse,
  GoogleResponse,
  isGoogleErrorResponse,
  isGoogleResponse,
} from "@/services/google-cse/types";

const callParamsList = [
  { siteStrict: false, cx: 0 },
  { siteStrict: true, cx: 0 },
  { siteStrict: false, cx: 1 },
  { siteStrict: true, cx: 1 },
];

export const GET = async (request: NextRequest) => {
  const clientRequestUrl = new URL(request.url);
  const searchString = clientRequestUrl.searchParams.get("car");
  if (!searchString)
    return new NextResponse("google search error: no query string", {
      status: 500,
    });
  const startIndex = clientRequestUrl.searchParams.get("startIndex") || "1";
  try {
    let response;
    for (let callParams of callParamsList) {
      response = await makeRequest(
        callParams.siteStrict,
        searchString,
        startIndex,
        callParams.cx
      );
      if (isGoogleResponse(response)) {
        break;
      }
      if (isGoogleErrorResponse(response)) {
        const error = response?.error?.status
          ? response?.error?.status
          : "unknown error";
        console.log(callParams, error);
      }
    }

    if (!isGoogleResponse(response)) {
      throw new Error("unexpected response");
    }

    const pagination = getPaginationInfo(response);
    return NextResponse.json(
      { images: response?.items || [], ...pagination },
      { status: 200 }
    );
  } catch (err) {
    console.log(`failed to find images with google: ${getErrorMessage(err)}`);
    return NextResponse.json(
      { images: [], error: getErrorMessage(err) },
      { status: 500 }
    );
  }
};

function getPaginationInfo(response: GoogleResponse) {
  return {
    total: response.searchInformation.totalResults,
    thisPageStart: response.queries.request[0].startIndex,
    nextPageStart: response.queries.nextPage
      ? response.queries.nextPage[0].startIndex
      : "na",
    previousPageStart: response.queries.previousPage
      ? response.queries.previousPage[0].startIndex
      : "na",
  };
}

async function makeRequest(
  siteStrict = false,
  q: string,
  start = "1",
  cx?: number
): Promise<GoogleResponse | GoogleErrorResponse> {
  if (
    !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ||
    !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY_2 ||
    !process.env.GOOGLE_CUSTOM_SEARCH_ID ||
    !process.env.GOOGLE_CUSTOM_SEARCH_ID_2
  ) {
    throw new Error("error accessing google custom search api");
  }
  const url = siteStrict
    ? new URL("https://www.googleapis.com/customsearch/v1/siterestrict/")
    : new URL("https://www.googleapis.com/customsearch/v1/");
  url.searchParams.append(
    "key",
    cx && cx === 1
      ? process.env.GOOGLE_CUSTOM_SEARCH_API_KEY_2
      : process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
  );
  url.searchParams.append(
    "cx",
    cx && cx === 1
      ? process.env.GOOGLE_CUSTOM_SEARCH_ID_2
      : process.env.GOOGLE_CUSTOM_SEARCH_ID
  );
  url.searchParams.append("searchType", "image");
  url.searchParams.append("imgType", "photo");
  url.searchParams.append("imgSize", "large");
  url.searchParams.append("q", q);
  // url.searchParams.append("exactTerms", q);
  url.searchParams.append("start", start);
  url.searchParams.append("imgColorType", "color");
  // url.searchParams.append("siteSearch", "autoevolution.com/cars/*");
  // url.searchParams.append("siteSearch", "auto-data.net/images/*");
  // url.searchParams.append("siteSearchFilter", "i");
  const requestUrl = url.toString();
  console.log("google-search requestUrl", requestUrl);
  try {
    return await fetch(requestUrl).then((res) => res.json());
  } catch (err) {
    console.log("google-search endpoint error", err);

    throw new Error(
      `failed to find images with google cx-${cx}: ${getErrorMessage(err)}`
    );
  }
}
