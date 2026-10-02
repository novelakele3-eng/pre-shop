type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  total: number;
};

type OrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return json(
      { ok: false, error: "Telegram environment variables are not configured." },
      500,
    );
  }

  let payload: OrderPayload;

  try {
    payload = (await req.json()) as OrderPayload;
  } catch {
    return json({ ok: false, error: "Invalid JSON request." }, 400);
  }

  if (
    !payload?.customerName?.trim() ||
    !payload?.phone?.trim() ||
    !payload?.address?.trim() ||
    !Array.isArray(payload.items) ||
    payload.items.length === 0
  ) {
    return json({ ok: false, error: "Missing required order information." }, 400);
  }

  const itemLines = payload.items.map((item, index) => {
    const total = Number(item.total) || Number(item.price) * Number(item.quantity);
    return [
      `${index + 1}. ${item.name}${item.size ? ` — ${item.size}` : ""}`,
      `   Qty: ${item.quantity} × ${item.price} ETB = ${total} ETB`,
    ].join("\n");
  });

  const message = [
    "🛍 NEW ORDER",
    "",
    `👤 Customer: ${payload.customerName.trim()}`,
    `📞 Phone: ${payload.phone.trim()}`,
    `📍 Address: ${payload.address.trim()}`,
    "",
    itemLines.join("\n"),
    "",
    `🧾 GRAND TOTAL: ${Number(payload.total) || 0} ETB`,
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      return json(
        { ok: false, error: "Telegram could not receive the order." },
        502,
      );
    }

    return json({ ok: true });
  } catch {
    return json(
      { ok: false, error: "Could not connect to Telegram." },
      502,
    );
  }
}
