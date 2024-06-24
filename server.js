import { fileURLToPath } from "url";
import express from "express";
import path from "path";

import fetchTVMazeDataForTVShowName from "./tvmaze/fetchTVMazeDataForTVShowName.js";
import generateJWT from "./access_control/generateJWT.js";
import verifyHMAC from "./access_control/validateHMAC.js";
import decodeJWT from "./access_control/decodeJWT.js";

const app = express();
const PORT = 3001;

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use((req, _res, next) => {
  console.info(req.method, req.originalUrl);
  next();
});

app.post("/webhook/*", async (req, res, next) => {
  const isHmacValid = await verifyHMAC(
    req.headers["kindly-hmac"],
    req.headers["kindly-hmac-algorithm"],
    req.rawBody
  );
  if (!isHmacValid) {
    res.status(401).send("Unauthorized");
    return;
  }

  next();
});

app.post("/webhook/helloworld", async (_req, res) => {
  res.status(200).json({
    reply: "Hello World!",
  });
});

app.post("/webhook/tvmaze", async (req, res) => {
  const showName = req.body.context.TVShowName;
  if (!showName) {
    res.status(200).send({
      exchange_slug: "tvmazeerror",
    });
    return;
  }
  try {
    const data = await fetchTVMazeDataForTVShowName(showName);
    res.status(200).json({
      exchange_slug: "tvmazeresult",
      new_context: {
        TVShowName: data.name,
        TVShowRating: data.rating,
        TVShowGenre: data.genre,
        TVShowSummary: data.summary,
      },
    });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(200).send({
      exchange_slug: "tvmazeerror",
    });
  }
});

app.post("/webhook/am_i_authenticated", async (req, res) => {
  let decodedJwt = null;
  try {
    const authorization = req.headers.authorization?.replace("Bearer ", "");
    if (authorization) {
      decodedJwt = await decodeJWT(authorization, req.body.chat_id);
    } else {
      console.error("No JWT provided");
    }
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({
    reply: `
      Hello${decodedJwt ? ` <b>${decodedJwt?.name}</b>` : ""}!<br/>
      Your JWT is ${decodedJwt ? "" : "in"}valid.<br/>
      ${decodedJwt ? `Your user ID is <b>${decodedJwt?.sub}</b>.` : ""}
    `,
  });
});

app.post("/authenticate", async (req, res) => {
  const token = await generateJWT(req.body.chatId, req.body.name);
  res.status(200).json({
    token,
  });
});

// Demo static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "demo")));

app.use((_req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
