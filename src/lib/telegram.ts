export type OrderPayload = {
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; size: string; quantity: number; price: number; total: number }[];
  total: number;
};

/**
 * IMPORTANT:
 * Do NOT put your Telegram bot token in React/Vite frontend code.
 * The browser can expose VITE_* values to users.
 *
 * This function calls YOUR backend endpoint.
 * Your backend keeps TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID private.
 */
export async function sendOrder(payload: OrderPayload) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Could not send order.");
  }

  return response.json();
}