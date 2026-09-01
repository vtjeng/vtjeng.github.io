const GITHUB_PAGES_ORIGIN = "https://vtjeng.github.io";

export async function proxyGitHubPagesProject({ request }, projectPath) {
  const publicUrl = new URL(request.url);

  if (publicUrl.pathname === projectPath) {
    publicUrl.pathname += "/";
    return Response.redirect(publicUrl, 308);
  }

  const upstreamUrl = new URL(publicUrl.pathname + publicUrl.search, GITHUB_PAGES_ORIGIN);
  const upstreamRequest = new Request(upstreamUrl, request);
  const upstreamResponse = await fetch(upstreamRequest, { redirect: "manual" });

  const location = upstreamResponse.headers.get("location");
  if (!location) return upstreamResponse;

  const upstreamLocation = new URL(location, upstreamUrl);
  if (upstreamLocation.origin !== GITHUB_PAGES_ORIGIN) return upstreamResponse;

  const publicLocation = new URL(
    upstreamLocation.pathname + upstreamLocation.search + upstreamLocation.hash,
    publicUrl.origin,
  );
  const headers = new Headers(upstreamResponse.headers);
  headers.set("location", publicLocation);

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}
