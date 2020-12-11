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
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: false,
    })
  )
  .get("/", (req, res) => res.send(`Node.js running on port : ${PORT}`))
  .get("/dev", function (req, res) {
    const googleCredentialKey = "AIzaSyCpz3uFpG1uSfvP9RklFzKViQ6JF6-onvg";

    axios
      .post(
        `https://vision.googleapis.com/v1/images:annotate?key=${googleCredentialKey}`,
        {
          requests: [
            {
              image: {
                source: {
                  imageUri: "https://systemtechdesign.com/91_1.jpg",
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
        console.log(res.data.responses[0].fullTextAnnotation);
        console.log(res.data.responses[0].fullTextAnnotation.text);
      });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
