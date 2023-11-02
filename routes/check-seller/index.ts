import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req: Request, _ctx: HandlerContext) {
    const reqUrl = decodeURIComponent(_req.url);
    const emailSeller = new URL(reqUrl).searchParams.get("email");


    
    return new Response(emailSeller);
  },
};
