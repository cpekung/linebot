const functions = require("firebase-functions");
const request = require("request-promise");

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message/reply";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer AOAMJRgHX3sXBGUk9hKUFaOoTdRCynN9LdwMD33/MwDGXskXkp63jak6D1y6c4bj9U6gQJreh4a96gmznVgzw5Slrpb1mP0CIVEtsEPoMmkBu8U5jywlBGoCLKI7Yu/b0Up0zhVg8f53ph2prQW12gdB04t89/1O/w1cDnyilFU=`,
};

// exports.LineBotPush = functions.https.onRequest((req, res) => {
//   return request({
//     method: `GET`,
//     uri:
//       `https://api.line.me/v2/bot/profile/` + req.body.events[0].source.userId,
//     headers: LINE_HEADER,
//     json: true,
//   })
//     .then((response) => {
//       return push(res, response, req);
//     })
//     .catch((error) => {
//       return res.status(500).send(error);
//     });
// });

// const push = (res, msg, req) => {
//   return request({
//     method: `POST`,
//     uri: `${LINE_MESSAGING_API}/push`,
//     headers: LINE_HEADER,
//     body: JSON.stringify({
//       to: req.body.events[0].source.userId,
//       messages: [
//         {
//           type: "flex",
//           altText: "Flex Message",
//           contents: {
//             type: "bubble",
//             hero: {
//               type: "image",
//               url: msg.pictureUrl,
//               size: "full",
//               aspectRatio: "20:13",
//               aspectMode: "cover",
//               action: {
//                 type: "uri",
//                 label: "Line",
//                 uri: "https://linecorp.com/",
//               },
//             },
//             body: {
//               type: "box",
//               layout: "vertical",
//               contents: [
//                 {
//                   type: "text",
//                   text: msg.displayName,
//                   size: "xl",
//                   weight: "bold",
//                 },
//                 {
//                   type: "box",
//                   layout: "vertical",
//                   spacing: "sm",
//                   margin: "lg",
//                   contents: [
//                     {
//                       type: "box",
//                       layout: "baseline",
//                       spacing: "sm",
//                       contents: [
//                         {
//                           type: "text",
//                           text: "Status",
//                           flex: 1,
//                           size: "sm",
//                           color: "#AAAAAA",
//                         },
//                         {
//                           type: "text",
//                           text: msg.statusMessage,
//                           flex: 5,
//                           size: "sm",
//                           color: "#666666",
//                           wrap: true,
//                         },
//                         {
//                           type: "text",
//                           text: req.body.events[0].source.type,
//                           flex: 5,
//                           size: "sm",
//                           color: "#666666",
//                           wrap: true,
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           },
//         },
//       ],
//     }),
//   })
//     .then(() => {
//       return res.status(200).send(`Done`);
//     })
//     .catch((error) => {
//       return Promise.reject(error);
//     });
// };

exports.LineBotPush = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    if (req.body.events[0].type === "follow") {
      request({
        method: `GET`,
        uri:
          `https://api.line.me/v2/bot/profile/` +
          req.body.events[0].source.userId,
        headers: LINE_HEADER,
        json: true,
      })
        .then((response) => {
          greetingReply(req.body, response);
        })
        .catch((error) => {
          return res.status(500).send(error);
        });
    } else {
      reply(req.body);
    }
  } else {
    return res.status(200).send(`Done`);
  }
});

const reply = (bodyResponse) => {
  return request({
    method: `POST`,
    uri: LINE_MESSAGING_API,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          type: `text`,
          text: bodyResponse.events[0].message.text,
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "cameraRoll",
                  label: "Camera Roll",
                },
              },
              {
                type: "action",
                action: {
                  type: "camera",
                  label: "Camera",
                },
              },
              {
                type: "action",
                action: {
                  type: "location",
                  label: "Location",
                },
              },
              {
                type: "action",
                imageUrl:
                  "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-1-512.png",
                action: {
                  type: "message",
                  label: "Message",
                  text: "Hello World!",
                },
              },
              {
                type: "action",
                action: {
                  type: "postback",
                  label: "Postback",
                  data: "action=buy&itemid=123",
                  displayText: "Buy",
                },
              },
              {
                type: "action",
                imageUrl:
                  "https://icla.org/wp-content/uploads/2018/02/blue-calendar-icon.png",
                action: {
                  type: "datetimepicker",
                  label: "Datetime Picker",
                  data: "storeId=12345",
                  mode: "datetime",
                  initial: "2018-08-10t00:00",
                  max: "2018-12-31t23:59",
                  min: "2018-08-01t00:00",
                },
              },
            ],
          },
        },
      ],
    }),
  });
};

const greetingReply = (bodyResponse, profile) => {
  return request({
    method: `POST`,
    uri: LINE_MESSAGING_API,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: bodyResponse.events[0].replyToken,
      messages: [
        {
          type: "flex",
          altText: "Flex Message",
          contents: {
            type: "bubble",
            header: {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "text",
                  text: "ยินดีต้อนรับ",
                  size: "sm",
                  weight: "bold",
                  color: "#AAAAAA",
                },
              ],
            },
            hero: {
              type: "image",
              url:
                "https://cpekung.github.io/liff/19ca21e07b459080c98ea2619d1d6468.jpg",
              gravity: "center",
              size: "full",
              aspectRatio: "1:1",
              aspectMode: "cover",
              action: {
                type: "uri",
                label: "Action",
                uri: "https://linecorp.com/",
              },
            },
            body: {
              type: "box",
              layout: "horizontal",
              spacing: "md",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  flex: 1,
                  contents: [
                    {
                      type: "image",
                      url: profile.pictureUrl,
                      gravity: "bottom",
                      size: "sm",
                      aspectRatio: "4:3",
                      aspectMode: "cover",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "vertical",
                  flex: 2,
                  contents: [
                    {
                      type: "text",
                      text: "สวัสดีคะ คุณ " + profile.displayName,
                      flex: 1,
                      size: "xs",
                      gravity: "top",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "ขอบคุณที่เป็นเพื่อนกับ MobilBot นะคะ",
                      flex: 2,
                      size: "xs",
                      gravity: "center",
                      wrap: true,
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    }),
  });
};
