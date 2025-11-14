import QRCode from "qrcode";

export const generateTicketQR = async (ticketId: string) => {
  const qr = await QRCode.toDataURL(ticketId);
  return qr;
};
