export const printApproval = (requisitionData, totalCost, getRowTotal) => {
  const { vendor, authority, attachment, ...approvalToPrint } = requisitionData.approval;

  let attachmentHtml = "";
  if (attachment) {
    if (attachment.type && attachment.type.startsWith("image/")) {
      const attachmentUrl = URL.createObjectURL(attachment);
      attachmentHtml = `<tr>
        <th>Attachment</th>
        <td><img src="${attachmentUrl}" alt="Attachment" style="max-width: 100%; height: auto;" /></td>
      </tr>`;
    } else {
      attachmentHtml = `<tr><th>Attachment</th><td>${attachment.name}</td></tr>`;
    }
  }

  const printHtml = `
    <html>
      <head>
        <title>Print Preview</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .header h2 { margin: 0; font-size: 20px; font-weight: bold; }
          .subheader { text-align: center; margin-top: 10px; }
          .content table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .content th, .content td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .content th { background: #f4f4f4; }
          .notes { margin-top: 30px; font-size: 14px; }
          .notes p { margin: 4px 0; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
          .signatures div { width: 45%; }
          .footer { position: fixed; bottom: 20px; left: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PUNE INSTITUTE OF COMPUTER TECHNOLOGY</h1>
          <p>DHANKAWADI, PUNE - 43</p>
        </div>
        <div class="subheader">
          <h2>PURCHASE REQUISITION</h2>
        </div>
        <hr/>
        <div class="content">
          <h3>General Details</h3>
          <table>
            ${Object.entries(requisitionData.generalDetails)
              .map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`)
              .join("")}
          </table>
          <h3>Items to be Procured</h3>
          ${
            requisitionData.items.length > 0
              ? (() => {
                  const headers = Object.keys(requisitionData.items[0]);
                  return `<table>
                    <tr>
                      ${headers.map(header => `<th>${header}</th>`).join("")}
                      <th>Row Total</th>
                    </tr>
                    ${requisitionData.items
                      .map(item => `<tr>
                        ${headers.map(header => `<td>${item[header] ?? ""}</td>`).join("")}
                        <td>₹${getRowTotal(item).toFixed(2)}</td>
                      </tr>`)
                      .join("")}
                  </table>`;
                })()
              : "<p>No items found.</p>"
          }
          <h4>Total Estimated Cost: ₹${totalCost.toFixed(2)}</h4>
          <h3>Approval Details</h3>
          <table>
            ${Object.entries(approvalToPrint)
              .map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`)
              .join("")}
            ${attachmentHtml}
          </table>
        </div>
        <div class="notes">
          <p><strong>NOTES:</strong></p>
          <p>1. Indentor must ensure completeness and correctness of the description of items to be procured along with any other special requirements such as test certificates.</p>
          <p>2. In case of any deviations, I/C Purchase must ensure relevant corrections in this indent, duly initiated by indentor.</p>
          <p><strong>Remarks:</strong></p>
          <p>1. Approved / NOT Approved AND FORWARDED TO PURCHASE OFFICER / FUNCTION HEAD / COMMITTEE COORDINATOR FOR FURTHER ACTION.</p>
          <p>2. FORWARDED TO MANAGEMENT FOR APPROVAL.</p>
        </div>
        <div class="signatures">
          <div>
            <p>Indentor Signature:</p>
            <br/>
            <p>_________________________</p>
          </div>
          <div>
            <p>Function Head / Committee Coordination:</p>
            <br/>
            <p>_________________________</p>
          </div>
        </div>
        <div class="signatures" style="justify-content: space-between; margin-top: 20px;">
          <div>
            <p>Date:</p>
            <p>_________________</p>
          </div>
          <div>
            <p>Principal Signature:</p>
            <p>_________________</p>
          </div>
        </div>
        <div class="footer">P.F-PUR / 09 / R3</div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  printWindow.document.write(printHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
