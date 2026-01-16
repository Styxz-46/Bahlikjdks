const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

module.exports = async (req, res) => {
  const text = req.query.text || "Isi text dulu bang";
  const username = req.query.username || "Unknown";
  const avatarUrl = req.query.avatar;

  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, width, height);

  // Header
  const headerY = 120;

  if (avatarUrl) {
    try {
      const response = await axios.get(avatarUrl, {
        responseType: "arraybuffer",
      });
      const avatar = await loadImage(response.data);

      const size = 80;
      ctx.save();
      ctx.beginPath();
      ctx.arc(140, headerY, size / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatar, 100, headerY - size / 2, size, size);
      ctx.restore();
    } catch (e) {}
  }

  ctx.fillStyle = "#000";
  ctx.font = "bold 36px Sans";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(username, 200, headerY);

  ctx.font = "bold 52px Sans";
  ctx.textAlign = "center";
  wrapText(ctx, text, width / 2, height / 2, 900, 70);

  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer("image/png"));
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const startY = y - (lines.length / 2) * lineHeight;
  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight);
  });
}
