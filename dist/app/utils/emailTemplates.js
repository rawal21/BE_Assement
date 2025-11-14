"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketConfirmationTemplate = void 0;
const ticketConfirmationTemplate = (userName, eventTitle, seatIds) => {
    return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>🎉 Ticket Confirmed!</h2>

      <p>Hi <b>${userName}</b>,</p>
      <p>Your booking for <b>${eventTitle}</b> is confirmed.</p>

      <h3>🎟 Seats Booked:</h3>
      <p>${seatIds.join(", ")}</p>

      <h3>📌 QR Code</h3>
      <img src="cid:qrCodeImage" width="200" />

      <p>Show this QR code at the event entrance.</p>
      <br/>
      <p>Thanks for booking with us!</p>
    </div>
  `;
};
exports.ticketConfirmationTemplate = ticketConfirmationTemplate;
