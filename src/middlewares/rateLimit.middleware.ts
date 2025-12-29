import rateLimit from "express-rate-limit";

// pentru auth (login / register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 20, // 20 request-uri / IP
  standardHeaders: true,
  legacyHeaders: false,
});

// pentru endpoint-uri generale
export const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minut
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
