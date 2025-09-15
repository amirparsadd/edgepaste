import { serve } from "@hono/node-server"
import app from "./app"

serve({
  fetch: app.fetch
}, (info) => console.log(info))