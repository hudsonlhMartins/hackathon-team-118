const Socket = require("websocket").server;
const http = require("http");

const server = http.createServer((req, res) => {});

server.listen(3000, () => {
  console.log("Listening on port 3000...");
});

const webSocket = new Socket({ httpServer: server });

let users = [];
let sellers = [];
//TODO: criar um array para sellers

webSocket.on("request", (req) => {
  // request === conection
  const connection = req.accept();
  console.log("list of users:", users);

  connection.on("message", (message) => {
    const data = JSON.parse(message.utf8Data);
    // console.log("server.js -> user -> data.username", {
    //   username: data.username,
    //   type: data.type,
    // });
    const user = users.find((user) => user.username === data.username);

    switch (data.type) {
      // deno-lint-ignore no-case-declarations
      case "store_user": // salvar a conecao do user
        if (user != null) {
          return;
        }
        const newUser = {
          conn: connection,
          productInfo: data.product,
          userInfo: data.userInfo,
          username: data.username,
        };

        users.push(newUser);

        sellers.forEach((element) => {
          //TODO: fazer um if para verificar as categorias do seller em comparação as categoruas do produto enviado pelo usuario antes de enviar o sendData abaixo
          if (element.categoryList.includes(data.product.categoryId)) {
            sendData({
              type: "contact",
              userInfo: data.userInfo,
              productInfo: data.product,
            }, element.conn);
          }
        });
        console.log(newUser.username);
        break;

      case "store_seller": // salvar a conecao do seller
        {
          const newSeller = {
            conn: connection,
            sellerName: data.sellerName,
            categoryList: data.categoryList,
          };

          sellers.push(newSeller);
          console.log("SELLERS----->", sellers);
        }

        break;

      case "store_offer":
        if (user == null) return;
        user.offer = data.offer;
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
          connection,
        );

        user.candidates.forEach((candidate) => {
          sendData(
            {
              type: "candidate",
              candidate: candidate,
            },
            connection,
          );
        });

        break;
    }
  });

  connection.on("close", (reason, description) => {
    users.forEach((user) => {
      if (user.conn == connection) {
        users.splice(users.indexOf(user), 1);
        return;
      }
    });
  });
});

function sendData(data, conn) {
  conn.send(JSON.stringify(data));
}

function findUser(username) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username) return users[i];
  }
}
