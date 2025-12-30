import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import helmet from "helmet";
import { authRateLimiter, generalRateLimiter } from "./middlewares/rateLimit.middleware.js";
import cors from "cors";
import auditRoutes from "./routes/audit.routes.js";
import contractRoutes from "./routes/contract.routes.js"
import subscriptionRoutes from "./routes/subscription.routes.js"
import { billingTriggerMiddleware } from "./middlewares/billingTrigger.middleware.js"
import { authMiddleware } from "./middlewares/auth.middleware.js"

const allowedOrigins = [
  "http://localhost:3000",       // dev
  "https://my-frontend.vercel.app" // prod - it is an example, change it to your real frontend URL
];

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(billingTriggerMiddleware)
}


app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(helmet());
app.disable("x-powered-by");

app.use(authMiddleware)
app.use(billingTriggerMiddleware)

app.use(generalRateLimiter);

app.use("/auth", authRateLimiter, authRoutes);
app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/audit", auditRoutes);

app.use("/contracts", contractRoutes)
app.use("/subscriptions", subscriptionRoutes)

//  trebuie ultimul
app.use(errorMiddleware);

export default app;
