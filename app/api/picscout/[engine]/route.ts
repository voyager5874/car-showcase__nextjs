import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";
import PicScout from "picscout";
// scraping doesn't comply with vercel fair use policy https://vercel.com/docs/concepts/limits/fair-use-policy
// Must be running on the client side, but this causes CORS error.
// create some express server to do all the scraping and provide an api
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
  const searchSettings = new URLSearchParams();
  if (engine === "google") {
    searchSettings.append("imgType", "photo");
    searchSettings.append("imgColorType", "color");
    searchSettings.append("exactTerms", query);
  }
  if (engine === "bing") {
    // doesn't seem to make any difference
    searchSettings.append("count", "150");
    searchSettings.append("imageType", "Photo");
    searchSettings.append("minHeight", "300");
    searchSettings.append("color", "Monochrome");
  }
  try {
    const res = await PicScout.search(query, {
      engine: engine,
      additionalQueryParams: searchSettings,
    });
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
