import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  GoogleErrorResponse,
  GoogleResponse,
  isGoogleErrorResponse,
} from "@/services/google-cse/types";

export const GET = async (request: NextRequest) => {
  const clientRequestUrl = new URL(request.url);
  const searchString = clientRequestUrl.searchParams.get("car");
  if (!searchString)
    return new NextResponse("google search error: no query string", {
      status: 500,
    });
  const startIndex = clientRequestUrl.searchParams.get("startIndex") || "1";

  try {
    const response = await makeRequest(false, searchString, startIndex);
    console.log("google images search response json", response);

    if (isGoogleErrorResponse(response) && response?.error?.code === 429) {
      try {
        const response: GoogleResponse | GoogleErrorResponse =
          await makeRequest(true, searchString, startIndex);
        console.log("google images search response", response);
        if (isGoogleErrorResponse(response) && response?.error?.code === 429) {
          const error = response?.error?.status
            ? response?.error?.status
            : "unknown error";
          throw new Error(error);
        }
        if (isGoogleErrorResponse(response)) {
          throw new Error(response.error.message);
        }

        const searchInfo = {
          total: response.searchInformation.totalResults,
          thisPageStart: response.queries.request[0].startIndex,
          nextPageStart: response.queries.nextPage
            ? response.queries.nextPage[0].startIndex
            : "na",
          previousPageStart: response.queries.previousPage
            ? response.queries.previousPage[0].startIndex
            : "na",
        };
        return NextResponse.json(
          { images: response?.items || [], searchInfo: searchInfo },
          {
            status: 200,
          }
        );
      } catch (err) {
        return NextResponse.json(
          {
            images: [],
            error: `failed to find images with google: ${getErrorMessage(err)}`,
          },
          {
            status: 500,
          }
        );
      }
    }
    if (isGoogleErrorResponse(response))
      throw new Error(response.error.message);

    const searchInfo = {
      total: response.queries.request[0].totalResults,
      thisPageStart: response.queries.request[0].startIndex,
      nextPageStart: response.queries.nextPage
        ? response.queries.nextPage[0].startIndex
        : "na",
      previousPageStart: response.queries.previousPage
        ? response.queries.previousPage[0].startIndex
        : "na",
    };

    return NextResponse.json(
      // { images: json?.items.map(item => item.image), searchInfo },
      { images: response?.items || [], searchInfo },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(`failed to find images with google: ${getErrorMessage(err)}`);
    return NextResponse.json(
      { images: [], error: getErrorMessage(err) },
      { status: 500 }
    );
  }
};

async function makeRequest(
  siteStrict = false,
  q: string,
  start = "1"
): Promise<GoogleResponse | GoogleErrorResponse> {
  if (
    !process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL ||
    !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ||
    !process.env.GOOGLE_CUSTOM_SEARCH_ID ||
    !process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL_SITESTRICT
  ) {
    throw new Error("error accessing google custom search api");
  }
  const url = siteStrict
    ? new URL("https://www.googleapis.com/customsearch/v1/siterestrict/")
    : new URL("https://www.googleapis.com/customsearch/v1/");
  url.searchParams.append("key", process.env.GOOGLE_CUSTOM_SEARCH_API_KEY);
  url.searchParams.append("cx", process.env.GOOGLE_CUSTOM_SEARCH_ID);
  url.searchParams.append("searchType", "image");
  url.searchParams.append("imgType", "photo");
  url.searchParams.append("imgSize", "large");
  url.searchParams.append("q", q);
  url.searchParams.append("exactTerms", q);
  url.searchParams.append("start", start);
  url.searchParams.append("imgColorType", "color");
  // url.searchParams.append("siteSearch", "autoevolution.com/cars/*");
  // url.searchParams.append("siteSearchFilter", "i");
  const requestUrl = url.toString();
  console.log("google-search requestUrl", requestUrl);
  try {
    const res = await fetch(requestUrl);
    return await res.json();
  } catch (err) {
    console.log("google-search endpoint error", err);

    throw new Error(
      `failed to find images with google: ${getErrorMessage(err)}`
    );
  }
}
