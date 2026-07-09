import { Resend } from "resend";

export const sendOrderConfirmationEmail = async ({
  to,
  orderIds = [],
  products = [],
  totalPrice = 0,
  paymentMethod = "cod",
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing in environment");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!to) throw new Error("Recipient email is missing");

  const itemsHtml = products
    .map((p) => {
      const name = p.productId?.name || p.name || "Product";
      const qty = Number(p.quantity || 1);
      const price = Number(p.price || 0).toFixed(2);
      return `<li>${qty} × ${name} — $${price}</li>`;
    })
    .join("");

  await resend.emails.send({
    from: "Raqsa Store <onboarding@resend.dev>",
    to, // customer email
    subject: "Your Raqsa Order Confirmation 🛒",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #111;">
        
        <h1 style="color: #232f3e;">Thank you for your order!</h1>
        <p style="font-size: 14px; color: #555;">
          We're getting your items ready to ship. We'll notify you when your order has shipped.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <h2 style="font-size: 16px; color: #232f3e;">Order Details</h2>
        <p><strong>Order ID(s):</strong><br/>${orderIds.join("<br/>")}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f6f6f6; text-align: left;">
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Qty</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (p) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${p.productId?.name || p.name || "Product"}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${Number(p.quantity || 1)}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${Number(p.price || 0).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="font-size: 16px; font-weight: bold; color: #232f3e; text-align: right;">
          Total Paid: $${Number(totalPrice).toFixed(2)}
        </p>

        <p style="font-size: 14px; color: #555;">
          We appreciate your business! <br/>
          — <strong>Raqsa Team</strong>
        </p>

        <p style="font-size: 12px; color: #888;">
          This is an automated message. Please do not reply.
        </p>

      </div>
    `,
  });
};
