import { MasterdataSellerRepository } from "$store/service/repositories/implementations/MasterdataSellerRepository.ts";
import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: HandlerContext) {
    const md = new MasterdataSellerRepository();

    const reqUrl = decodeURIComponent(_req.url);
    const emailSeller = new URL(reqUrl).searchParams.get("email");

    const sellerData = await md.findByEmail(emailSeller as string);

    return new Response(JSON.stringify(sellerData));
  },
};
