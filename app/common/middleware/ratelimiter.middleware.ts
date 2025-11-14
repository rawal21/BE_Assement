import rateLimit from 'express-rate-limit';

// Example: allow max 5 bookings per hour per IP
 
 export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    message: "Too many booking attempts from this IP, please try again after an hour."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


