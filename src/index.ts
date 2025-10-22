import express from "express";

import cors from "cors";

import helmet from "helmet";

import rateLimit from "express-rate-limit";
import { connectedDb, port } from "./configs/db.configs.js";
import router from "./routes/index.route.js";

const app = express();

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute (60,000 ms)
    max: 5, // each IP to 5 requests
    message: {
      success: false,
      message: "Too many requests, please try again after a minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// catch JSON syntax errors
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof SyntaxError && "body" in err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid JSON format." });
    }
    next(err);
  }
);

connectedDb().then(async () => {
  app.listen(port, () => {
    console.log(`Server running on PORT`, port);
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

app.use("/api", router);

// final error handler (for other errors)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
);
