import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const GET = async (
  request: NextRequest,
  { params }: { params: { key: string } }
) => {
  const { key } = params;
  if (!key)
    return NextResponse.json(
      { link: null, error: "no file id provided" },
      {
        status: 500,
      }
    );
  const url = new URL(`https://api.wikimedia.org/core/v1/commons/file/${key}`);
  const requestUrl = url.toString();
  try {
    const res = await fetch(requestUrl);
    const json = await res.json();
    console.log("wiki commons get file info res json", json);
    return NextResponse.json(
      { link: json?.preferred?.url || "" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { link: null, error: getErrorMessage(err) },
      { status: 500 }
    );
  }
};
