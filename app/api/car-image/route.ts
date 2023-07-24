import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  if (!process.env.IMAGINSTUDIO_API_KEY || !process.env.CARS_IMAGES_API_URL)
    return new NextResponse("error accessing cars images", { status: 500 });
  const query = new URL(request.url).searchParams;
  const url = new URL(process.env.CARS_IMAGES_API_URL);
  url.search = query.toString();
  url.searchParams.append("customer", process.env.IMAGINSTUDIO_API_KEY);
  url.searchParams.append("zoomType", "fullscreen");
  try {
    const requestUrl = url.toString();
    console.log("requestUrl", requestUrl);

    const res = await fetch(requestUrl);
    const blob = await res.blob();
    return new NextResponse(blob, {
      status: 200,
    });
  } catch (err) {
    console.log("get images endpoint error", err);
    const message = err instanceof Error ? err.message : "";
    return new NextResponse(`cars images api error: ${message}`, {
      status: 500,
    });
  }
};
