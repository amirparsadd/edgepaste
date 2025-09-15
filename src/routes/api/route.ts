import { Hono } from "hono";
import { z } from 'zod/mini'
import { zValidator } from '@hono/zod-validator'
import { createKey } from "../../utils/key";
import { get, remove, set } from "../../storage";

export const apiRoute = new Hono()
export const HEADER = "EDGEPASTE_ENTRY"
export const ADMIN_KEY_LENGTH = 8

apiRoute.post(
  "/paste",
  zValidator("json", z.object({
    contents: z.string().check(z.maxLength(1000000))
  })),
  async (ctx) => {
    const data = ctx.req.valid("json")
    const key = createKey(6)
    const adminKey = createKey(ADMIN_KEY_LENGTH)

    try {
      await set(
        key,
        `${HEADER}\n`+
        `${adminKey}\n`+
        data.contents
      )

      return ctx.json({ key, adminKey })
    } catch (error) {
      console.error(error)

      return ctx.text("Internal Server Error", 500)
    }
  }
)

apiRoute.get(
  "/paste/:key",
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

      return ctx.json({
        result: result.split("\n").slice(2).join("\n")
      })
    } catch (error) {
      console.error(error)

      return ctx.text("Internal Server Error", 500)
    }
  }
)

apiRoute.delete(
  "/paste/:key",
  zValidator(
    "json",
    z.object({
      adminKey: z.string().check(z.length(8))
    })
  ),
  async (ctx) => {
    const key = ctx.req.param().key
    const userAdminKey = ctx.req.valid("json").adminKey

    try {
      const result = await get(key)

      if(result === null) {
        return ctx.text("Not Found", 404)
      }

      if(result.split("\n")[0] !== HEADER) {
        await remove(key)
        return ctx.text("Invalid Entry", 500)
      }

      const actualAdminKey = result.split("\n")[1]

      if(userAdminKey !== actualAdminKey) {
        return ctx.text("Invalid Admin Key", 401)
      }

      await remove(key)
      return ctx.text("Success")
    } catch (error) {
      console.error(error)

      return ctx.text("Internal Server Error", 500)
    }
  }
)