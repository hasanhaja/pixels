import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import { instantiate } from "../pixels-engine/lib/rs_lib.generated.js";

const { add, greet, holler } = await instantiate();

console.log(add(1, 2));

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = { message: `${greet("Pixel")}`};
});

router.get("/holler", (ctx) => {
  ctx.response.body = { message: `${holler("Pixel")}`};
});

router.get("/:imageName", async (ctx) => {
  if (ctx.params.imageName === "image.png") {
    try {
      const file = await Deno.readFile("./pixels-api/assets/image.png");
      ctx.response.body = file;
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