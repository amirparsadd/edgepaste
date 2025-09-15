import app from "./app"

// Make it compatible with R1Cloud Edge
export default {
  async fetch(request: Request) {
    return app.fetch(request)
  }
}
