import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const GET = async (
  request: NextRequest,
  { params }: { params: { key: string } }
) => {
  const { key } = params;
  try {
    const response = await makeRequest(key);
    return NextResponse.json(
      { items: response.items },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      { items: [], error: getErrorMessage(err) },
      {
        status: 500,
      }
    );
  }
};

async function makeRequest(pageTitle: string) {
  const url = new URL(
    `https://en.wikipedia.org/api/rest_v1/page/media-list/${pageTitle}`
  );
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);
    const json = await res.json();
    console.log("wikipedia/media-list req requestUrl", requestUrl);
    console.log("wikipedia/media-list response json", json);
    if (json?.title && json.title === "Not found.") {
      throw new Error("wikipedia article not found");
    }
    return json;
  } catch (err) {
    throw new Error(` ${getErrorMessage(err)}`);
  }
}
