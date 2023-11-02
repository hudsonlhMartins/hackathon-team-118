import { MasterdataSellerRepository } from "$store/service/repositories/implementations/MasterdataSellerRepository.ts";
import { HandlerContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: HandlerContext) {
    const md = new MasterdataSellerRepository();


    const sellerData = await md.listSeller();

    return new Response(JSON.stringify(sellerData));
  },
};
