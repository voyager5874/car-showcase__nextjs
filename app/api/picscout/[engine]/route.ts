import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";
import PicScout from "picscout";

type Param = {
  params: {
    engine: "bing" | "google" | "duckduckgo";
  };
};

export const GET = async (request: NextRequest, { params }: Param) => {
  const clientRequestUrl = new URL(request.url);
  const query = clientRequestUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json(
      { items: [], error: "picscout error - no words to search for" },
      {
        status: 400,
      }
    );
  const { engine } = params;
  if (!engine)
    return NextResponse.json(
      { items: [], error: "picscout error engine param not provided" },
      {
        status: 400,
      }
    );
  try {
    const res = await PicScout.search(query, { engine: engine });
    console.log("picscout scrape", res);
    return NextResponse.json(
      { items: res },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(getErrorMessage(err));
    return NextResponse.json(
      { items: [], error: `picscout error ${getErrorMessage(err)}` },
      {
        status: 500,
      }
    );
  }
};