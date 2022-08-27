import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import { instantiate } from "../pixels-engine/lib/rs_lib.generated.js";

const { grayscale, blur } = await instantiate();

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = { message: "Welcome to Pixels"};
});

const files = (dir: string): Array<string> => {
  const contents = Deno.readDirSync(`./pixels-api/${dir}`);

  return [...contents].filter(content => content.isFile).map(content => content.name);
}

router.get("/blur/:imageName", async (ctx) => {
  const imageName = ctx.params.imageName;
  if (files("assets").includes(imageName)) {
    try {
      const file = await Deno.readFile(`./pixels-api/assets/${imageName}`);
      const blurImage = blur(file, 25.0);
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
  if (files("assets").includes(imageName)) {
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