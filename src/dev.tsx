import { serve } from "@hono/node-server"
import app from "./app"
import { DEV } from "./env"

serve({
  fetch: app.fetch,
  port: DEV.PORT || 3000,
  hostname: DEV.HOSTNAME || "localhost"
}, (info) => console.log(info))