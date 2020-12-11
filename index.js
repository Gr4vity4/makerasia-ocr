const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 9999;
const request = require("request");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");

app
  .use("/img", express.static(path.join(__dirname, "public")))
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: false,
    })
  )
  .get("/", (req, res) => res.send(`Node.js running on port : ${PORT}`))
  .get("/webhook", function (req, res) {
    console.log(">>> /webhook");
    imgPath = req.query.path;
    // const replyToken = req.body.events[0].replyToken;
    // const msg = req.body.events[0].message;

    // console.log(`Message token : ${replyToken}`);

    // console.log("Message data");

    // console.log(typeof msg);
    // console.log(msg);
    // console.log(`msg id : ${msg.id}`);

    // const URL = `https://api-data.line.me/v2/bot/message/${msg.id}/content`;

    // const lineToken = "__Line_Token__";
    const googleCredentialKey = "AIzaSyDG5ZjQBdiHDNPQVM7mKqoLXseyq0np9aw";

    let result = "text not found";

    axios
      .post(
        `https://vision.googleapis.com/v1/images:annotate?key=${googleCredentialKey}`,
        {
          requests: [
            {
              image: {
                source: {
                  imageUri: `https://systemtechdesign.com/${imgPath}`,
                },
              },
              features: [
                {
                  type: "DOCUMENT_TEXT_DETECTION",
                },
              ],
              imageContext: {
                languageHints: ["th"],
              },
            },
          ],
        },
        {
          headers: { "content-type": "application/json" },
        }
      )
      .then((res) => {
        // console.log(res)
        // console.log(">>> debug 1");
        // console.log(res.data.responses[0]);
        // console.log(">>> debug 2");
        // console.log(res.data.responses[0].fullTextAnnotation);
        // console.log(">>> debug 3");
        console.log(res.data.responses[0].fullTextAnnotation.text);
        result = res.data.responses[0].fullTextAnnotation.text;

        res.json({
          status: 200,
          message: result,
        });
      });

    // axios
    //   .get(URL, {
    //     responseType: "stream",
    //     headers: {
    //       Authorization: `Bearer {${lineToken}}`,
    //     },
    //   })
    //   .then(function (response) {
    //     // handle success
    //     console.log(`typeof response : ${typeof response.data}`);

    //     response.data.pipe(fs.createWriteStream("public/lp.jpg"));

    //     console.log(`>>> google result`);

    //     axios
    //       .post(
    //         `https://vision.googleapis.com/v1/images:annotate?key=${googleCredentialKey}`,
    //         {
    //           requests: [
    //             {
    //               image: {
    //                 source: {
    //                   imageUri: "https://corgidude.herokuapp.com/img/lp.jpg",
    //                 },
    //               },
    //               features: [
    //                 {
    //                   type: "DOCUMENT_TEXT_DETECTION",
    //                 },
    //               ],
    //               imageContext: {
    //                 languageHints: ["th"],
    //               },
    //             },
    //           ],
    //         },
    //         {
    //           headers: { "content-type": "application/json" },
    //         }
    //       )
    //       .then((res) => {
    //         // console.log(res)
    //         console.log(res.data.responses[0].fullTextAnnotation);
    //         console.log(res.data.responses[0].fullTextAnnotation.text);
    //       });
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   });

    // console.log(`Message from chat : ${msg}`)
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
