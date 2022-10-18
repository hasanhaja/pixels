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

router.get("/blur/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  if ((await files("assets")).includes(imageName)) {
    try {
      const file = await Deno.readFile(`./pixels-api/assets/${imageName}`);
      const blurImage = blur(file, 2.5);
      ctx.response.body = blurImage;
    } catch (_err) {
      ctx.response.body = { message: `Could not read file: ${imageName}`};
    }
  } else {
    ctx.response.body = { message: `${imageName} not found`};
  }
});

router.get("/blurunscaled/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  if ((await files("assets")).includes(imageName)) {
    try {
      const file = await Deno.readFile(`./pixels-api/assets/${imageName}`);
      const blurImage = blur_unscaled(file, 25.0);
      ctx.response.body = blurImage;
    } catch (_err) {
      ctx.response.body = { message: `Could not read file: ${imageName}`};
    }
  } else {
    ctx.response.body = { message: `${imageName} not found`};
  }
});

router.get("/gray/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  if ((await files("assets")).includes(imageName)) {
    try {
      const file = await Deno.readFile(`./pixels-api/assets/${imageName}`);
      const grayImage = grayscale(file);
      ctx.response.body = grayImage;
    } catch (_err) {
      ctx.response.body = { message: `Could not read file: ${imageName}`};
    }
  } else {
    ctx.response.body = { message: `${imageName} not found`};
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });