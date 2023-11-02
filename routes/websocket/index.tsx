import { HandlerContext, PageProps } from "$fresh/server.ts";
import { DecoSiteState, DecoState } from "deco/types.ts";
import { MasterdataSellerRepository } from "$store/service/repositories/implementations/MasterdataSellerRepository.ts";

/*
const getPropsFromRequest = async (req: Request) => {
  const url = new URL(req.url);
  const data = req.method === "POST"
    ? await req.clone().json()
    : bodyFromUrl("props", url);

  return data ?? {};
};
*/

let users: any = [];
let sellers: any = [];

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
    const data = JSON.parse(event.data);

    const user = users.find((user: any) => user.username === data.username);

    switch (data.type) {
      case "store_user":
        {
          if (user != null) {
            return;
          }
          const newUser = {
            conn: socket,
            productInfo: data.product,
            userInfo: data.userInfo,
            username: data.username,
          };

          users.push(newUser);
          closeConnect(newUser, socket);

          sellers.forEach((element: any) => {
            if (element.categoryList.includes(`/${data.product.categoryId}/`)) {
              sendData({
                type: "contact",
                userInfo: data.userInfo,
                productInfo: data.product,
              }, element.conn);
            }
          });
        }

        break;

      case "store_seller":
        {
          const newSeller = {
            conn: socket,
            sellerName: data.sellerName,
            categoryList: data.categoryList,
          };

          sellers.push(newSeller);
          console.log("SELLERS----->", sellers);

          closeConnect(newSeller, socket);
        }
        break;

      case "store_offer":
        {
          if (user == null) return;
          user.offer = data.offer;
        }
        break;

      case "store_candidate":
        if (user == null) {
          return;
        }
        if (user.candidates == null) user.candidates = [];

        user.candidates.push(data.candidate);
        break;

      case "send_answer":
        console.log("USERaa");
        console.log("USER", user);
        if (user == null) {
          return;
        }
        console.log("answer", data.answer);
        sendData(
          {
            type: "answer",
            answer: data.answer,
          },
          user.conn,
        );
        break;

      case "send_candidate":
        if (user == null) {
          return;
        }

        sendData(
          {
            type: "candidate",
            candidate: data.candidate,
          },
          user.conn,
        );
        break;

      case "join_call":
        if (user == null) {
          return;
        }

        sendData(
          {
            type: "offer",
            offer: user.offer,
          },
          socket,
        );

        user.candidates.forEach((candidate: any) => {
          sendData(
            {
              type: "candidate",
              candidate: candidate,
            },
            socket,
          );
        });

        break;

      default:
        break;
    }
  });

  return response;
};

function closeConnect(data: any, conn: any) {
  conn.addEventListener("close", (event: any) => {
    //TODO: ir no masterdata quando for seller e inativa o seller atual

    if ("sellerName" in data) {
      const masterdataSellerRepository = new MasterdataSellerRepository();
      (async () => {
        await masterdataSellerRepository.updateStatus(data.sellerName, false);
      })();
    }

    console.log("close event", event);
  });
}

function sendData(data: any, conn: any) {
  conn.send(JSON.stringify(data));
}
