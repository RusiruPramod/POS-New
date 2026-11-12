import React from "react";
import { usePOS } from "../../context/POSContext";

export const FinancePrintWrapper = () => {
  const { financePrintData } = usePOS();

  if (!financePrintData) return null;

  const { sales, fromDate, toDate, grossRev, totalDel, netRev, settings } =
    financePrintData;

  let totalCost = 0;
  sales.forEach((s) => {
    (s.items || []).forEach((i) => {
      totalCost += (i.cost || 0) * i.qty;
    });
  });

  const estProfit = netRev - totalCost;

  return (
    <div id="finance-print-wrapper" style={{ display: "none" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {settings.logo && (
          <img
            src={settings.logo}
            alt="Logo"
            style={{ maxHeight: "60px", margin: "0 auto 10px auto", display: "block" }}
          />
        )}
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {settings.company || "Unyt Mart"}
        </h2>
        {settings.address && (
          <div style={{ fontSize: "13px", color: "#333", marginTop: "2px" }}>
            {settings.address}
          </div>
        )}
        {settings.phone && (
          <div style={{ fontSize: "13px", color: "#333", marginTop: "2px" }}>
            Tel: {settings.phone}
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: "center",
          margin: "18px 0",
          borderBottom: "2px solid #000",
          paddingBottom: "10px",
        }}
      >
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
          PROFESSIONAL FINANCIAL STATEMENT
        </h3>
        <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>
          Period: <strong>{fromDate || "Beginning"}</strong> to{" "}
          <strong>{toDate || "Present"}</strong>
        </p>
      </div>

      {/* Summary Metrics Box */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          border: "1px solid #333",
          padding: "12px",
          background: "#f9f9f9",
          fontSize: "12px",
        }}
      >
        <div>
          <strong>Gross Revenue:</strong>{" "}
          <span>
            {settings.currency} {grossRev.toFixed(2)}
          </span>
        </div>
        <div>
          <strong>Total Delivery:</strong>{" "}
          <span>
            {settings.currency} {totalDel.toFixed(2)}
          </span>
        </div>
        <div>
          <strong>Net Revenue:</strong>{" "}
          <span>
            {settings.currency} {netRev.toFixed(2)}
          </span>
        </div>
        <div>
          <strong>Est. Profit:</strong>{" "}
          <span>
            {settings.currency} {estProfit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Detailed Ledger Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #000", backgroundColor: "#f1f1f1" }}>
            <th style={{ padding: "6px", textAlign: "left" }}>Invoice #</th>
            <th style={{ padding: "6px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "6px", textAlign: "right" }}>Subtotal</th>
            <th style={{ padding: "6px", textAlign: "right" }}>Tax</th>
            <th style={{ padding: "6px", textAlign: "right" }}>Discount</th>
            <th style={{ padding: "6px", textAlign: "right" }}>Delivery</th>
            <th style={{ padding: "6px", textAlign: "right" }}>Gross Total</th>
            <th style={{ padding: "6px", textAlign: "right" }}>Net Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                style={{ padding: "12px", textAlign: "center", color: "#666" }}
              >
                No financial records found for the selected period.
              </td>
            </tr>
          ) : (
            sales.map((s) => {
              const deliveryCharge =
                s.rawDelivery !== undefined
                  ? s.rawDelivery
                  : s.delivery > 0
                  ? s.delivery
                  : settings.delivery || 0;
              const grossTotal = s.total || 0;
              const net = grossTotal - deliveryCharge;

              return (
                <tr key={s.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "6px", fontFamily: "monospace" }}>{s.id}</td>
                  <td style={{ padding: "6px" }}>
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "6px", textAlign: "right" }}>
                    {settings.currency} {Number(s.subtotal || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: "6px", textAlign: "right" }}>
                    {settings.currency} {Number(s.tax || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: "6px", textAlign: "right" }}>
                    {settings.currency} {Number(s.discount || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: "6px", textAlign: "right" }}>
                    {settings.currency} {deliveryCharge.toFixed(2)}
                  </td>
                  <td style={{ padding: "6px", textAlign: "right", fontWeight: "bold" }}>
                    {settings.currency} {grossTotal.toFixed(2)}
                  </td>
                  <td style={{ padding: "6px", textAlign: "right", fontWeight: "bold" }}>
                    {settings.currency} {net.toFixed(2)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Signature & Timestamp */}
      <div
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#333",
        }}
      >
        <div>
          Generated on: <span>{new Date().toLocaleString()}</span>
        </div>
        <div>Authorized Signature: ______________________</div>
      </div>
    </div>
  );
};

