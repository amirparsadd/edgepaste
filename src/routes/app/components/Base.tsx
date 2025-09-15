import type { FC } from "hono/jsx";

export const Base: FC = (props) => {
  return (
    <>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EdgePaste</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body class={"bg-slate-700 flex flex-col items-center justify-center w-screen h-screen text-slate-50"}>
        <div>
          <h1 class={"font-bold text-center text-3xl"}>EdgePaste</h1>
          <h2 class={"text-sm text-center font-light"}>A simple and easy pastebin!</h2>
          <div class={"mt-4 bg-slate-900 rounded-md p-4"}>
            {props.children}
          </div>
        </div>
      </body>
      </html>
    </>
  )
}