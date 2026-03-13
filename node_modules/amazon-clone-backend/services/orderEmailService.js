const ORDER_NOTIFICATION_EMAIL =
  process.env.ORDER_NOTIFICATION_EMAIL || 'ankitempire06@gmail.com';

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
}

function buildOrderEmail(order) {
  const itemsMarkup = order.items
    .map(
      (item) =>
        `<li style="margin-bottom:8px;">${item.name} x ${item.quantity} - ${formatCurrency(
          item.price * item.quantity
        )}</li>`
    )
    .join('');

  return {
    subject: `New Amazon Clone order #${order.id}`,
    text: [
      `Order #${order.id} has been placed.`,
      `Status: ${order.status}`,
      `Total: ${formatCurrency(order.total_amount)}`,
      '',
      'Items:',
      ...order.items.map(
        (item) =>
          `- ${item.name} x ${item.quantity} - ${formatCurrency(
            item.price * item.quantity
          )}`
      ),
      '',
      'Shipping address:',
      order.shipping_address
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111;">
        <h2 style="margin-bottom: 8px;">Order #${order.id} placed successfully</h2>
        <p style="margin: 0 0 12px;">Status: <strong>${order.status}</strong></p>
        <p style="margin: 0 0 16px;">Total: <strong>${formatCurrency(
          order.total_amount
        )}</strong></p>
        <h3 style="margin-bottom: 8px;">Items</h3>
        <ul style="padding-left: 20px;">${itemsMarkup}</ul>
        <h3 style="margin-bottom: 8px;">Shipping address</h3>
        <p style="white-space: pre-line;">${order.shipping_address}</p>
      </div>
    `
  };
}

function isMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

export async function sendOrderConfirmationEmail(order) {
  if (!isMailConfigured()) {
    console.warn(
      'Order email skipped: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, or SMTP_FROM is missing.'
    );
    return { sent: false, reason: 'missing_config' };
  }

  let nodemailer;
  try {
    ({ default: nodemailer } = await import('nodemailer'));
  } catch (error) {
    console.warn(
      'Order email skipped: nodemailer is not installed. Run `npm install nodemailer` in backend.'
    );
    return { sent: false, reason: 'missing_dependency', error };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const email = buildOrderEmail(order);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: ORDER_NOTIFICATION_EMAIL,
    subject: email.subject,
    text: email.text,
    html: email.html
  });

  return { sent: true };
}
