/**
 * Unyt Mart POS WhatsApp Web Receipt Generator
 */
export const formatWhatsAppReceipt = (sale, settings) => {
  let rawPhone = sale.customer?.phone || "";
  let cleanPhone = rawPhone.replace(/[^0-9]/g, "");

  if (cleanPhone.startsWith("0")) {
    cleanPhone = "94" + cleanPhone.substring(1);
  } else if (cleanPhone.length === 9) {
    cleanPhone = "94" + cleanPhone;
  }

  if (!cleanPhone) {
    throw new Error("Please provide a valid phone number with country code.");
  }

  const currency = settings.currency || "Rs.";
  let msg = `*--- ${(settings.company || "UNYT MART").toUpperCase()} RECEIPT ---*\n`;
  msg += `Invoice #: ${sale.id}\n`;
  msg += `Date: ${new Date(sale.date).toLocaleString()}\n\n`;

  if (sale.customer?.name) msg += `Customer: ${sale.customer.name}\n`;
  if (sale.customer?.address) msg += `Address: ${sale.customer.address}\n`;
  if (sale.customer?.tracking) msg += `Courier Ref: ${sale.customer.tracking}\n`;
  msg += `------------------------------\n`;

  (sale.items || []).forEach((i) => {
    const itemSizeStr = i.size && i.size !== "-" ? ` (${i.size})` : "";
    msg += `${i.name}${itemSizeStr} x ${i.qty} = ${currency} ${(i.price * i.qty).toFixed(2)}\n`;
  });

  msg += `------------------------------\n`;
  msg += `Subtotal: ${currency} ${(sale.subtotal || 0).toFixed(2)}\n`;

  if (sale.showDeliverySep && sale.delivery > 0) {
    msg += `Delivery Fee: ${currency} ${sale.delivery.toFixed(2)}\n`;
  }

  if (sale.discount > 0) {
    msg += `Discount: ${currency} ${sale.discount.toFixed(2)}\n`;
  }

  msg += `*TOTAL AMOUNT: ${currency} ${(sale.total || 0).toFixed(2)}*\n\n`;

  const codVal =
    sale.codAmount ||
    (sale.paymentMethod === "COD"
      ? `${currency} ${(sale.total || 0).toFixed(2)}`
      : "0.00/=");
  msg += `*COD AMOUNT: ${codVal}*\n\n`;

  msg += `Payment Method: ${sale.paymentMethod || "COD"}\n\n`;
  msg += `${settings.footer || "Thank you for shopping with Unyt Mart!"}`;

  return { cleanPhone, message: msg };
};

export const sendWhatsAppReceipt = (sale, settings) => {
  try {
    const { cleanPhone, message } = formatWhatsAppReceipt(sale, settings);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, "_blank");
    return true;
  } catch (error) {
    alert(error.message);
    return false;
  }
};

