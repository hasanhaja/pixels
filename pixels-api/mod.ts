import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import { instantiate } from "../pixels-engine/lib/rs_lib.generated.js";

const { grayscale } = await instantiate();

const IMAGE = "flowers.jpg";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = { message: "Welcome to Pixels"};
});

router.get("/:imageName", async (ctx) => {
  if (ctx.params.imageName === IMAGE) {
    try {
      const file = await Deno.readFile(`./pixels-api/assets/${IMAGE}`);
      const grayImage = grayscale(file);
      console.log(file);
      console.log(grayImage);
      ctx.response.body = grayImage;
    } catch (_err) {
      ctx.response.body = { message: `Could not read file: ${ctx.params.imageName}`};
    }
  } else {
    ctx.response.body = { message: `${ctx.params.imageName} not found`};
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });