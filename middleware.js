import { NextResponse } from "next/server";

export function middleware(request) {
  const nextUrl = request.nextUrl;

  // Access individual query parameters
  const utm = nextUrl.searchParams.get("utm");

  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next();
  if (utm) response.cookies.set("utm", utm);

  return response;
}
