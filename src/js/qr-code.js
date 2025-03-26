export function generateQRCodeSVGDataUri(text) {
  const qrcode = new QRCode({
    content: text,
    padding: 1,
    color: "#000000",
    background: "#ffffff",
    ecl: "M",
  });
  const svg = qrcode.svg();
  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return svgDataUri;
}
