import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import helmet from "helmet";
import { authRateLimiter, generalRateLimiter } from "./middlewares/rateLimit.middleware.js";
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",       // dev
  "https://my-frontend.vercel.app" // prod - it is an example, change it to your real frontend URL
];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(helmet());
app.disable("x-powered-by");

app.use(generalRateLimiter);

app.use("/auth", authRateLimiter, authRoutes);
app.use("/health", healthRoutes);
app.use("/users", userRoutes);

//  trebuie ultimul
app.use(errorMiddleware);

export default app;
