import { HandlerContext, PageProps } from "$fresh/server.ts";
import { DecoSiteState, DecoState } from "deco/types.ts";
import { MasterdataSellerRepository } from "$store/service/repositories/implementations/MasterdataSellerRepository.ts";
import { FalseLiteral } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";
import { SellerType } from "$store/service/repositories/ISellerRepository.ts";

/*
const getPropsFromRequest = async (req: Request) => {
  const url = new URL(req.url);
  const data = req.method === "POST"
    ? await req.clone().json()
    : bodyFromUrl("props", url);

  return data ?? {};
};
*/

interface sellerType  {
  sellerName: string
  categoryList: string,
  conn: any
}
interface userType  {
  username: string
  userInfo: string,
  productInfo: string
  sellerName?: string
  conn: any
}

let users: any[] = [];
let sellers: any[] = [];

const masterdataSellerRepository = new MasterdataSellerRepository();
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

  socket.addEventListener("message", async (event) => {
    const data = JSON.parse(event.data);

    const user = users.find((user: any) => user.username === data.username);

    switch (data.type) {
      case "store_user":
        {

          
          if (user != null) {
            sendData({
              type: "error",
              message: "voce ja tem uma call em andamento"
            }, socket);
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

         

          sellers.forEach(async(element: sellerType) => {
            if (
              element.categoryList.includes("/" + data.product.categoryId + "/")
            ) {

              const sellerBanco = await findSellerBanco(element.sellerName)
              if(!sellerBanco || !sellerBanco.length){
                return
              }
              const sellerCurrent = sellerBanco[0]

              if(!sellerCurrent.isActive){

                sendData({
                  type: "error",
                  message: "seller ja esta em uma call"
                }, socket);

                return
              }

           
              await updateStatus(element.sellerName, false)
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

          await updateStatus(data.sellerName, true);

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
        if (user == null) {
          return;
        }

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
        const email = data.sellerName;

        await updateStatus(email, false);
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

      case "leave_call":
     
        if ("sellerName" in data) {
         
          await updateStatus(data.sellerName, true);
          return;
        }

        const userIndex = users.findIndex((user: any) =>
          user.username === data.username
        );

        if (user < 0) return;

        users.splice(userIndex, 1);
        user.conn.close();

        break;

      default:
        break;
    }
  });

  return response;
};

function closeConnect(data: any, conn: any) {
  conn.addEventListener("close", (event: any) => {

    if ("sellerName" in data) {
      console.log(' -----  CLOSE SELLER-----')
      ;(async () => {
        await updateStatus(data.sellerName, false);
        const indexItem = sellers.findIndex((el: any) =>
          el.sellerName === data.sellerName
        );
        if (indexItem < 0) return;

        sellers.splice(indexItem, 1);
      })();

      return
    }
    
    const userEmail = data.username
    const indexItem = users.findIndex((el: userType) =>
      el.username === userEmail
    );

    if (indexItem < 0) return;

    users.splice(indexItem, 1);


  });
}

async function updateStatus(id: string, status: boolean) {
  await masterdataSellerRepository.updateStatus(id, status);
}

async function findSellerBanco(email:string): Promise<SellerType[] | false> {
 return await masterdataSellerRepository.findByEmail(email);
}

function sendData(data: any, conn: any) {
  conn.send(JSON.stringify(data));
}
