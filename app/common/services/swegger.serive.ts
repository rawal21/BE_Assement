import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Booking API",
      version: "1.0.0",
      description: "API documentation for Event Booking System",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            phone: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            wallet: { type: "number" },
          },
        },

        Event: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            venue: { type: "string" },
            startAt: { type: "string", format: "date-time" },
            createdBy: { type: "string" },
            seats: {
              type: "array",
              items: { $ref: "#/components/schemas/Seat" },
            },
          },
        },

        Seat: {
          type: "object",
          properties: {
            seatId: { type: "string" },
            price: { type: "number" },
            status: {
              type: "string",
              enum: ["available", "reserved", "booked"],
            },
            reservedBy: { type: "string" },
            reservedAt: { type: "string", format: "date-time" },
          },
        },

        Booking: {
          type: "object",
          properties: {
            userId: { type: "string" },
            eventId: { type: "string" },
            seats: { type: "array", items: { type: "string" } },
            amount: { type: "number" },
            qrCode: { type: "string" },
            status: { type: "string", enum: ["booked", "used"] },
          },
        },
      },
    },
  },

  apis: ["./app/**/*.ts"], // adjust based on your structure
};
