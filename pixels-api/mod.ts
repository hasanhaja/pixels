import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import { instantiate } from "../pixels-engine/lib/rs_lib.generated.js";

const { grayscale, blur, blur_unscaled } = await instantiate();

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = { message: "Welcome to Pixels"};
});

const files = async (dir: string): Promise<Array<string>> => {
  const contents = [];

  for await (const content of Deno.readDir(`./pixels-api/${dir}`)) {
    if (content.isFile) {
      contents.push(content.name);
    }
  }

  return contents;
}
const processImage = async (ctx: any, imageName: string, handler: (file: Uint8Array) => Uint8Array) => {
  if ((await files("assets")).includes(imageName)) {
    try {
      const file = await Deno.readFile(`./pixels-api/assets/${imageName}`);
      const image = handler(file);
      ctx.response.body = image;
    } catch (_err) {
      ctx.response.body = { message: `Could not read file: ${imageName}`};
    }
  } else {
    ctx.response.body = { message: `${imageName} not found`};
  }
}
router.get("/blur/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  await processImage(ctx, imageName, (file) => blur(file, 2.5));
});

router.get("/blurunscaled/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  await processImage(ctx, imageName, (file) => blur_unscaled(file, 25.0));
});

router.get("/gray/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  await processImage(ctx, imageName, (file) => grayscale(file));
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });