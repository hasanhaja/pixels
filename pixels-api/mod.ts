import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/image.png")) {
    const file = await Deno.readFile("./assets/image.png");
    return new Response(file, {
      headers: {
        "content-type": "image/png",
      },
    });
  }

  return new Response(JSON.stringify({ name: "Welcome to Pixels"}), {
    headers: {
      "content-type": "application/json",
    },
  });
}

serve(handleRequest);