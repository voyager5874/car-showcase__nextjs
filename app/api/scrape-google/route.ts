import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";
import PicScout from "picscout";

export const GET = async (request: NextRequest) => {
  const clientRequestUrl = new URL(request.url);
  const query = clientRequestUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json(
      { items: [], error: "google scrape error - no words to search for" },
      {
        status: 400,
      }
    );
  try {
    const res = await PicScout.search(query, { engine: "google" });
    console.log("google scrape", res);
    return NextResponse.json(
      { items: res },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(getErrorMessage(err));
    return NextResponse.json(
      { items: [], error: `google scrape error ${getErrorMessage(err)}` },
      {
        status: 500,
      }
    );
  }
};
