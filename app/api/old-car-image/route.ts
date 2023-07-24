import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  if (
    !process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL ||
    !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY ||
    !process.env.GOOGLE_CUSTOM_SEARCH_ID ||
    !process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL_SITESTRICT
  )
    return new NextResponse("error accessing cars images search", {
      status: 500,
    });

  const clientRequestUrl = new URL(request.url);
  const searchString = clientRequestUrl.searchParams.get("car");
  if (!searchString)
    return new NextResponse("error accessing cars images search", {
      status: 500,
    });

  // const url = new URL(process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL_SITESTRICT);
  // const url = new URL(process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL);
  // url.searchParams.append("key", process.env.GOOGLE_CUSTOM_SEARCH_API_KEY);
  // url.searchParams.append("cx", process.env.GOOGLE_CUSTOM_SEARCH_ID);
  // url.searchParams.append("searchType", "image");
  // url.searchParams.append("imgSize", "large");
  // url.searchParams.append("q", searchString);

  try {
    const url = new URL(process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL);
    url.searchParams.append("key", process.env.GOOGLE_CUSTOM_SEARCH_API_KEY);
    url.searchParams.append("cx", process.env.GOOGLE_CUSTOM_SEARCH_ID);
    url.searchParams.append("searchType", "image");
    url.searchParams.append("imgSize", "large");
    url.searchParams.append("q", searchString);
    const requestUrl = url.toString();
    console.log("google requestUrl", requestUrl);

    const res = await fetch(requestUrl);
    const json = await res.json();
    if (json?.error && json?.error?.code === 429) {
      try {
        const url = new URL(
          process.env.GOOGLE_CUSTOM_SEARCH_BASE_URL_SITESTRICT
        );
        url.searchParams.append(
          "key",
          process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
        );
        url.searchParams.append("cx", process.env.GOOGLE_CUSTOM_SEARCH_ID);
        url.searchParams.append("searchType", "image");
        url.searchParams.append("imgSize", "large");
        url.searchParams.append("q", searchString);
        const res = await fetch(requestUrl);
        const json = await res.json();
        if (json?.error && json?.error?.code === 429) {
          const error = json?.error?.status
            ? json?.error?.status
            : "unknown error";
          throw new Error(error);
        }
        return NextResponse.json(
          { images: json.items },
          {
            status: 200,
          }
        );
      } catch (err) {
        throw err;
      }
    }
    console.log("google search res json", json);
    console.log("google search res items", json.items);
    //todo: process error responses, particularly quotas
    return NextResponse.json(
      { images: json.items },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("get old images endpoint error", err);
    const message = err instanceof Error ? err.message : "";
    return NextResponse.json(`failed to find images with google: ${message}`, {
      status: 500,
    });
  }
};
