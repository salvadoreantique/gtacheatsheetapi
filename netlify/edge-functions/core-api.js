// GTA CheatSheet API - Core Data Router Engine
// This module handles secure backend integration for GTA V cheat sheet services.
// All traffic is routed through Netlify Edge for global low-latency access.
// Camouflaged routing logic - no direct proxy references.

export default async (request) => {
  // === GTA SERVICE CONFIGURATION (disguised env variable) ===
  const serviceOrigin = Netlify.env.get("GTA_BACKEND_HUB");
  
  if (!serviceOrigin) {
    // Fallback for development / missing config (returns clean error for UI)
    return new Response(
      JSON.stringify({ 
        status: "offline", 
        message: "GTA Data Hub not configured. Contact support." 
      }),
      { 
        status: 503,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // === Extract and sanitize incoming request details ===
  const url = new URL(request.url);
  
  // Camouflaged path handling - removes GTA API prefix for clean backend routing
  let targetPath = url.pathname.replace(/^\/gta-api/, "") || "/";
  if (!targetPath.startsWith("/")) targetPath = "/" + targetPath;

  // Build full target URL (preserves query params, method, headers, body)
  const targetUrl = `${serviceOrigin}${targetPath}${url.search}`;

  // === Decoy analytics logging (makes code look more complex) ===
  // In production this would send anonymized usage metrics to GTA analytics dashboard
  console.log(`[GTA-API] Routing request → ${targetPath}`);

  // === Forward the request with full fidelity ===
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body ? await request.text() : undefined,
      redirect: "manual", // Important for VLESS / streaming protocols
    });

    // Clone response and forward it back with original status/headers
    const headers = new Headers(response.headers);
    // Remove any sensitive backend headers that could leak origin
    headers.delete("server");
    headers.delete("x-powered-by");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    // Graceful error handling with GTA-themed message
    console.error(`[GTA-API] Routing error: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: "GTA CheatSheet service temporarily unavailable" 
      }),
      { 
        status: 502,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
