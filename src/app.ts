import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middlewares/request-logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { globalLimiter } from "./middlewares/rate-limit.middleware";

import authRoutes from "./modules/auth/routes/auth.routes";
import userRoutes from "./modules/user/routes/user.routes";
import sellerRoutes from "./modules/seller/routes/seller.routes";
import productRoutes from "./modules/product/routes/product.routes";
import adminRoutes from "./modules/admin/routes/admin.routes";
import orderRoutes from "./modules/order/routes/order.routes";

const app = express();
app.use(cookieParser());
// 🔐 Trust proxy (important for deployments like Nginx, Heroku)
app.set("trust proxy", 1);

// 🔐 Security headers
app.use(helmet());

// 🌍 CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);

// 🚦 Global rate limiter
app.use(globalLimiter);

// 📦 Body parser
app.use(express.json({ limit: "10kb" }));

// 📝 Request logger
app.use(requestLogger);

// 🏥 Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// 🚀 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/seller", sellerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

// ❌ 404 handler (VERY IMPORTANT)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    timestamp: new Date().toISOString(),
  });
});

// 🔥 Global error handler (MUST BE LAST)
app.use(errorMiddleware);

export default app;
