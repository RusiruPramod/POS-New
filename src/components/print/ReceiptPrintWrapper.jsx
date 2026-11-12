import React, { useEffect } from "react";
import { usePOS } from "../../context/POSContext";

export const ReceiptPrintWrapper = () => {
  const { activePrintSale: sale, settings } = usePOS();

  const isDual = settings.dualPrint === true;

  useEffect(() => {
    let dynamicStyle = document.getElementById("react-dynamic-print-style");
    if (!dynamicStyle) {
      dynamicStyle = document.createElement("style");
      dynamicStyle.id = "react-dynamic-print-style";
      document.head.appendChild(dynamicStyle);
    }

    if (isDual) {
      dynamicStyle.innerHTML = `@page { size: landscape; margin: 0; }`;
    } else {
      dynamicStyle.innerHTML = "";
    }
  }, [isDual]);

  if (!sale) return null;

  const getSizeClass = () => {
    if (settings.receiptSize === "a6") return "a6-size";
    if (settings.receiptSize === "a5") return "a5-size";
    if (settings.receiptSize === "100%") return "a4-size";
    return "thermal-size";
  };

  const sizeClass = getSizeClass();
  const receiptWidthStyle =
    sizeClass === "thermal-size"
      ? { "--receipt-width": settings.receiptSize || "80mm" }
      : {};

  const renderReceiptContent = (copyTypeLabel) => (
    <div
      className={`receipt-content text-black bg-white ${sizeClass}`}
      style={receiptWidthStyle}
    >
      {isDual && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.05em",
            marginBottom: "5px",
            textDecoration: "underline",
          }}
        >
          {copyTypeLabel}
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        {settings.logo && (
          <img
            src={settings.logo}
            alt="Logo"
            style={{ maxHeight: "48px", margin: "0 auto 6px auto", display: "block" }}
          />
        )}
        <h2
          style={{
            margin: 0,
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "1.25rem",
          }}
        >
          {settings.company || "Unyt Mart"}
        </h2>
        {settings.address && (
          <div style={{ lineHeight: 1.35, color: "#222", fontSize: "0.85rem" }}>
            {settings.address}
          </div>
        )}
        {settings.phone && (
          <div style={{ color: "#222", fontSize: "0.85rem" }}>
            Tel: {settings.phone}
          </div>
        )}
      </div>

      <div style={{ borderTop: "2px solid #000", margin: "8px 0" }}></div>

      {/* Invoice Details & Customer Info Grid */}
      <div
        className="print-info-grid"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ lineHeight: 1.4 }}>
          <div>
            <strong>Invoice #:</strong> <span>{sale.id}</span>
          </div>
          <div>
            <strong>Date:</strong> <span>{new Date(sale.date).toLocaleDateString()}</span>
          </div>
          <div>
            <strong>Payment:</strong> <span>{sale.paymentMethod || "COD"}</span>
          </div>

          <div
            id="print-barcode-area"
            style={{
              marginTop: "10px",
              width: "140px",
              height: "45px",
              border: "2px dashed #000",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "10px",
              color: "#333",
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Place Courier Barcode Here
          </div>
        </div>

        <div
          id="print-customer-box"
          style={{ textAlign: "right", lineHeight: 1.4 }}
        >
          <div
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              marginBottom: "2px",
            }}
          >
            BILLED / DELIVERED TO:
          </div>
          {sale.customer?.name && (
            <div style={{ fontWeight: "bold" }}>Name: {sale.customer.name}</div>
          )}
          {sale.customer?.phone && <div>Phone: {sale.customer.phone}</div>}
          {sale.customer?.address && (
            <div style={{ maxWidth: "180px", marginLeft: "auto" }}>
              Address: {sale.customer.address}
            </div>
          )}
          {sale.customer?.tracking && (
            <div>Tracking: {sale.customer.tracking}</div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <table
        className="print-table"
        style={{
          width: "100%",
          textAlign: "left",
          borderCollapse: "collapse",
          marginBottom: "10px",
          fontSize: "0.85rem",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #000", backgroundColor: "#f8f9fa" }}>
            <th style={{ padding: "4px 2px" }}>Item Description</th>
            <th style={{ padding: "4px 2px", textAlign: "center", width: "40px" }}>
              Qty
            </th>
            <th style={{ padding: "4px 2px", textAlign: "right", width: "80px" }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {(sale.items || []).map((item, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "4px 2px" }}>
                {item.name}
                {item.size && item.size !== "-" && (
                  <span style={{ fontSize: "0.75em", color: "#555", marginLeft: "4px" }}>
                    [{item.size}]
                  </span>
                )}
              </td>
              <td style={{ padding: "4px 2px", textAlign: "center" }}>
                {item.qty}
              </td>
              <td style={{ padding: "4px 2px", textAlign: "right" }}>
                {(item.price * item.qty).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div
        className="print-totals"
        style={{
          lineHeight: 1.5,
          width: "100%",
          maxWidth: "240px",
          marginLeft: "auto",
          fontSize: "0.85rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal:</span>
          <span>
            {settings.currency} {Number(sale.subtotal || 0).toFixed(2)}
          </span>
        </div>

        {sale.showDeliverySep && sale.delivery > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Delivery Fee:</span>
            <span>
              {settings.currency} {Number(sale.delivery || 0).toFixed(2)}
            </span>
          </div>
        )}

        {sale.discount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Discount:</span>
            <span>
              {settings.currency} {Number(sale.discount || 0).toFixed(2)}
            </span>
          </div>
        )}

        <div
          style={{
            borderTop: "2px solid #000",
            marginTop: "4px",
            paddingTop: "4px",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "0.95rem",
          }}
        >
          <span>TOTAL:</span>
          <span>
            {settings.currency} {Number(sale.total || 0).toFixed(2)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
            padding: "4px 6px",
            border: "1px solid #000",
            borderRadius: "6px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          <span>COD Amount:</span>
          <span>
            {sale.codAmount ||
              (sale.paymentMethod === "COD"
                ? `${settings.currency} ${Number(sale.total || 0).toFixed(2)}`
                : "0.00/=")}
          </span>
        </div>
      </div>

      <div style={{ borderTop: "1px dashed #000", margin: "12px 0 6px 0" }}></div>

      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "0.85rem",
          marginTop: "6px",
        }}
      >
        {settings.footer || "Thank you for shopping with Unyt Mart!"}
      </div>
    </div>
  );

  return (
    <div
      id="print-wrapper"
      className={isDual ? "dual-print-mode" : ""}
      style={{ display: "none" }}
    >
      <div id="receipt-print-area">
        {renderReceiptContent("CUSTOMER INVOICE")}
      </div>

      {isDual && (
        <div id="receipt-print-area-merchant">
          {renderReceiptContent("MERCHANT INVOICE")}
        </div>
      )}
    </div>
  );
};

