import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/image.png")) {
    // Read the style.css file from the file system.
    const file = await Deno.readFile("./assets/image.png");
    // Respond to the request with the style.css file.
    return new Response(file, {
      headers: {
        "content-type": "image/png",
      },
    });
  }

  return new Response(JSON.stringify({ name: "Hasan"}), {
    headers: {
      "content-type": "application/json",
    },
  });
}

serve(handleRequest);