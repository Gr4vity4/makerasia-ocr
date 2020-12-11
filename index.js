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

function googleOCR(imgPath) {
  const googleCredentialKey = "AIzaSyDG5ZjQBdiHDNPQVM7mKqoLXseyq0np9aw";

  return axios.post(
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
  );
}

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

    googleOCR(imgPath).then((resData) => {
      const text = resData.data.responses[0].fullTextAnnotation.text;
      res.json({ text: text });
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
