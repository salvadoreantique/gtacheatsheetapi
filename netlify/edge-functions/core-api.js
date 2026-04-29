// GTA CheatSheet API - Core Data Router Engine (XHTTP Streaming Edition)
// Optimized for real-time GTA V cheat sheet data streaming over global edge network.
// Supports full bidirectional streaming for live updates and secure connections.

export default async (request) => {
  // === GTA SERVICE CONFIGURATION (disguised backend hub) ===
  const serviceOrigin = Netlify.env.get("GTA_BACKEND_HUB");
  
  if (!serviceOrigin) {
    return new Response(
      JSON.stringify({ 
        status: "offline", 
        message: "GTA Data Hub not configured. Please contact support team." 
      }),
      { 
        status: 503,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const url = new URL(request.url);
  
  // Camouflaged path stripping for clean backend routing
  let targetPath = url.pathname.replace(/^\/gta-api/, "") || "/";
  if (!targetPath.startsWith("/")) targetPath = "/" + targetPath;

  const targetUrl = `${serviceOrigin}${targetPath}${url.search}`;

  // === Decoy logging for analytics dashboard ===
  console.log(`[GTA-API] Streaming request → ${targetPath}`);

  try {
    // === DIRECT STREAMING FORWARD (XHTTP / VLESS optimized) ===
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,                    // ← critical: pass body as stream (no .text())
      redirect: "manual",
      duplex: "half",                        // ← enables proper bidirectional streaming
    });

    // Clone headers and strip any backend fingerprints
    const headers = new Headers(response.headers);
    headers.delete("server");
    headers.delete("x-powered-by");
    headers.delete("via");

    // Return the live stream directly to client
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

  } catch (error) {
    console.error(`[GTA-API] Stream routing error: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: "GTA CheatSheet service temporarily unavailable - please try again" 
      }),
      { 
        status: 502,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
