// GTA CheatSheet API - Core Data Router Engine (XHTTP Streaming)
// Fully transparent relay - forwards exact client path to backend (same as X-UI sub path)

export default async (request) => {
  const serviceOrigin = Netlify.env.get("GTA_BACKEND_HUB");
  
  if (!serviceOrigin) {
    return new Response(
      JSON.stringify({ status: "offline", message: "GTA Data Hub not configured." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(request.url);
  
  // NO stripping — exact path from client goes to backend (this is what you wanted)
  const targetPath = url.pathname + url.search;

  const targetUrl = `${serviceOrigin}${targetPath}`;

  console.log(`[GTA-API] Forwarding → ${targetPath}`);

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual",
      duplex: "half",
    });

    const headers = new Headers(response.headers);
    headers.delete("server");
    headers.delete("x-powered-by");
    headers.delete("via");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

  } catch (error) {
    console.error(`[GTA-API] Error: ${error.message}`);
    return new Response(
      JSON.stringify({ status: "error", message: "GTA CheatSheet service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
};
