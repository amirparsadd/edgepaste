import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { apiRoute } from './api/route'
import { appRoute } from './app/route.tsx'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { logger } from 'hono/logger'

export const baseRoute = new Hono()

baseRoute.use(cors({
  origin: "*"
}))
baseRoute.use(trimTrailingSlash())
baseRoute.use(logger())

baseRoute.route("/api", apiRoute)
baseRoute.route("/app", appRoute)