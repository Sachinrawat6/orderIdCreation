import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";

// Convert mm to px
const mmToPx = (mm) => (mm * 96) / 25.4;

const tagStyle = {
  width: `${mmToPx(100)}px`,
  height: `${mmToPx(50)}px`,
  boxSizing: "border-box",
  pageBreakAfter: "always",
  position: "relative",
  border: "1px solid #ccc",
  padding: "16px",
  backgroundColor: "#ffffff",
  color: "#000000",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.4",
};

const TagPDFGenerator = ({ csvData, order_id }) => {
  const containerRef = useRef(null);

  const exportTagsToPDF = async () => {
    const tagElements = containerRef.current.querySelectorAll(".tag-label");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [100, 50],
    });

    for (let i = 0; i < tagElements.length; i++) {
      const canvas = await html2canvas(tagElements[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      if (i !== 0) pdf.addPage([100, 50], "landscape");
      pdf.addImage(imgData, "PNG", 0, 0, 100, 50);
    }

    pdf.save("tags.pdf");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }} className="relative">
         <button
        onClick={exportTagsToPDF}
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          color: "black",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        className="absolute top-0 right-0 bg-yellow-200"
      >
        Download Tags
      </button>
      <div ref={containerRef} className="font-bold">
        {csvData?.map((tag, i) => (
          <div key={i} className="tag-label" style={tagStyle}>
            <p>
              <strong>Brand</strong>: Qurvii | <strong>SKU</strong>:{" "}
              {`${tag.style_number}-${tag.color}-${tag.size}`}
            </p>
            <p>
              <strong>Color</strong>: {tag.color} | <strong>Size</strong>:{" "}
              {tag.size}
            </p>
            <p>
              <strong>MRP</strong>: ₹{tag.mrp || "5333"} (Incl. of all taxes)
            </p>
            <p>Net Qty: 1 | Unit: 1 Pcs</p>
            <p>
              MFG & MKT BY: Qurvii, 2nd Floor, B-149 Sector-6,
              <br />
              Noida, UP, 201301
            </p>
            <p>
             <strong>Contact</strong> : support@qurvii.com  
            </p>
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
              }}
            >
              <QRCodeSVG
                value={order_id?.[i]?.order_id?.toString() || "542365"}
                size={80}
                level="H"
              />
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default TagPDFGenerator;
