import { HandlerContext, PageProps } from "$fresh/server.ts";

const getPropsFromRequest = async (req: Request) => {
  const url = new URL(req.url);
  const data = req.method === "POST"
    ? await req.clone().json()
    : bodyFromUrl("props", url);

  return data ?? {};
};

export const handler = async (
  req: Request,
  ctx: HandlerContext<
    unknown,
    DecoState<unknown, DecoSiteState>
  >,
): Promise<Response> => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });
  socket.addEventListener("message", (event) => {
    
    console.log('event', event)

    if (event.data === "ping") {
      socket.send("pong");
    }
  });
  return response;
};

// export const render = async (
//   previewUrl: string,
//   // deno-lint-ignore no-explicit-any
//   props: any,
//   req: Request,
//   ctx: HandlerContext<
//     unknown,
//     DecoState<unknown, DecoSiteState>
//   >,
// ) => {
//   const { state: { resolve } } = ctx;
//   const url = new URL(previewUrl);
//   const block = addLocal(url.pathname.replace(/^\/live\/previews\//, ""));

//   const end = ctx.state?.t.start("load-data");
//   const [params, pathname] = paramsFromUrl(url);
//   const newUrl = new URL(req.url);
//   if (pathname) {
//     newUrl.pathname = pathname;
//   }
//   const newReq = new Request(newUrl, {
//     headers: new Headers(req.headers),
//     method: "GET",
//   });
//   const page = await resolve(
//     {
//       __resolveType: "preview",
//       block,
//       props,
//     },
//     { forceFresh: false },
//     {
//       context: { ...ctx, params: params ?? ctx.params },
//       request: newReq,
//     },
//   );
//   end?.();

//   return await ctx.render(page);
// };

