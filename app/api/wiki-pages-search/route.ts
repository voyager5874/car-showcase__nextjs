import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";

const BASE_URL = "https://api.wikimedia.org/core/v1/wikipedia/en/search";
export const GET = async (request: NextRequest) => {
  const clientRequestUrl = new URL(request.url);
  const searchString = clientRequestUrl.searchParams.get("car");
  if (!searchString)
    return NextResponse.json(
      { error: "wikipedia title search error - no words to search for" },
      {
        status: 500,
      }
    );

  try {
    // const url = new URL(`${BASE_URL}/page`);
    const url = new URL(`${BASE_URL}/title`);
    url.searchParams.append("q", searchString);
    const requestUrl = url.toString();
    console.log("wikipedia search requestUrl", requestUrl);

    const res = await fetch(
      requestUrl

      // working without authorization [for now(?)]
      // {
      //   headers: {
      //     Authorization: `Bearer ${process.env.WIKIMEDIA_ACCESS_TOKEN}`,
      //     "Api-User-Agent": "YOUR_APP_NAME (YOUR_EMAIL_OR_CONTACT_PAGE)",
      //   },
      // }
    );
    const json = await res.json();
    console.log("wikipedia pages search res json", json);
    console.log("wikipedia pages search res pages", json?.pages);
    if (json?.pages?.length) {
      return NextResponse.json({ pages: json.pages }, { status: 200 });
    } else throw new Error("nothing found");
  } catch (err) {
    console.log("wikipedia search for pages error", err);
    return NextResponse.json(
      {
        pages: [],
        error: `wiki-pages-search error: ${getErrorMessage(err)}`,
      },
      {
        status: 500,
      }
    );
  }
};
