import { RateLimiterMemory } from "rate-limiter-flexible";

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./requiredEnv.js";
import { chatRouter } from "./chat/router.js";
import { authRouter } from "./auth/router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { langchainRouter } from "./langchain/router.js";
import { statusRouter } from "./status/router.js";

const app = express();
app.use(helmet());
app.disable("x-powered-by");
app.set("trust proxy", parseInt(env.TRUST_PROXY ?? "0"));
//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("combined"));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/langchain", langchainRouter);
app.use("/status", statusRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(404).json({ success: false, error: "Not found" });
});

const port = env.PORT ?? "3000";
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
