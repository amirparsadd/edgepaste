import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod/mini";
import { createKey } from "../../utils/key";
import { ADMIN_KEY_LENGTH, HEADER } from "../api/route";
import { get, remove, set } from "../../storage";
import { Base } from "./components/Base";
import { BASE_URL } from "../../env";

export const appRoute = new Hono()

appRoute.get(
  "/p/:key",
  async (ctx) => {
    const { key } = ctx.req.param()

    try {
      const result = await get(key)

      if(result === null) {
        return ctx.text("Not Found", 404)
      }

      if(result.split("\n")[0] !== HEADER) {
        await remove(key)
        return ctx.text("Invalid Entry", 500)
      }

      return ctx.text(result.split("\n").slice(2).join("\n"))
    } catch (error) {
      console.error(error)

      return ctx.text("Internal Server Error", 500)
    }
  }
)

appRoute.post(
  "/new",
  zValidator(
    "form",
    z.object({
      contents: z.string().check(z.maxLength(1000000))
    })
  ),
  async (ctx) => {
      const data = ctx.req.valid("form")
      const key = createKey(6)
      const adminKey = createKey(ADMIN_KEY_LENGTH)
  
      try {
        await set(
          key,
          `${HEADER}\n`+
          `${adminKey}\n`+
          data.contents
        )
  
        return ctx.html(
          <Base>
            <pre class={"w-[90vw] md:w-[70vw] p-1 bg-slate-800 rounded-sm"}>{data.contents}</pre>
            <p class={"text-center mt-1 text-sm font-mono"}>Admin Key: {adminKey}</p>
            <button
              class={"bg-blue-600 w-full mt-1 hover:bg-blue-800/75 transition-colors cursor-pointer p-1 rounded-md"}
              onclick={`navigator.clipboard.writeText("${BASE_URL}/app/p/${key}")`}
            >Copy Link</button>
          </Base>
        )
      } catch (error) {
        console.error(error)
  
        return ctx.text("Internal Server Error", 500)
      }
    }
)

appRoute.get(
  "/",
  async (ctx) => {
    return ctx.html(
      <Base>
        <form
          method="post"
          action={"/app/new"}
          class={"w-full md:w-[70vw]"}
        >
          <textarea
            name="contents"
            class={"bg-slate-800 w-full p-1 rounded-sm"}
            placeholder="Contents of paste..."
            required
            maxlength={1000000}
          ></textarea>
          <button
            class={"bg-green-600 w-full block rounded-md hover:bg-green-600/75 mt-2 p-1 cursor-pointer transition-colors"}
          >Create</button>
        </form>
      </Base>
    )
  }
)