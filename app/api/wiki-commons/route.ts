import { WikiSearchResponse } from "@/services/wikimedia-api/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const clientRequestUrl = new URL(request.url);
  const searchString = clientRequestUrl.searchParams.get("car");
  if (!searchString)
    return NextResponse.json(
      { error: "wikipedia title search error - no words to search for" },
      {
        status: 400,
      }
    );
  // const url = new URL(`https://api.wikimedia.org/core/v1/commons/search/title`);
  const url = new URL(`https://api.wikimedia.org/core/v1/commons/search/page`);
  url.searchParams.append("q", `${searchString}`);
  // url.searchParams.append("limit", `${100}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);

    const json: WikiSearchResponse = await res.json();
    console.log("wiki commons search json", json);
    if (!json?.pages?.length) {
      return NextResponse.json({ pages: [] }, { status: 404 });
    }
    return NextResponse.json({ pages: json.pages }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ pages: [] }, { status: 500 });
  }
};
