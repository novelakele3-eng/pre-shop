import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, PORT = 8787 } = process.env;

app.post("/api/orders", async (req, res) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).send("Telegram is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to backend/.env");
    }

    const { customerName, phone, address, items, total } = req.body;
    if (!customerName || !phone || !address || !items?.length) {
      return res.status(400).send("Missing order information.");
    }

    const lines = [
      "🛍 NEW ORDER",
      "",
      `👤 Customer: ${customerName}`,
      `📞 Phone: ${phone}`,
      `📍 Address: ${address}`,
      "",
      ...items.map((item, i) =>
        `${i + 1}. ${item.name} — ${item.size}\n   Qty: ${item.quantity} × ${item.price.toLocaleString()} ETB = ${item.total.toLocaleString()} ETB`
      ),
      "",
      `🧾 GRAND TOTAL: ${Number(total).toLocaleString()} ETB`
    ];

    const telegram = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: lines.join("\n")
        })
      }
    );

    if (!telegram.ok) {
      const error = await telegram.text();
      return res.status(502).send(`Telegram error: ${error}`);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

app.listen(PORT, () => console.log(`Order backend running on http://localhost:${PORT}`));