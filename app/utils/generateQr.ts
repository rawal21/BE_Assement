import QRCode from "qrcode";

export const generateVerificationQR = async (url: string) => {
  return QRCode.toBuffer(url);
};
