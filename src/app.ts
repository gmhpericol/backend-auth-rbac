import "dotenv/config";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/users", userRoutes);

//  trebuie ultimul
app.use(errorMiddleware);

export default app;
