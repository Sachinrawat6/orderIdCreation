import React, { useRef, useState, useEffect } from "react";
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
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [products, setProductsData] = useState([]);

  // fetching product name from API
  const fetchProducts = async () => {
    const response = await fetch(
      "https://inventorybackend-m1z8.onrender.com/api/product"
    );
    const result = await response.json();
    setProductsData(result);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const exportTagsToPDF = async () => {
    setIsGenerating(true);
    setProgress(0);

    const tagElements = containerRef.current.querySelectorAll(".tag-label");
    const totalTags = tagElements.length;

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

      // Update progress
      const currentProgress = Math.floor(((i + 1) / totalTags) * 100);
      setProgress(currentProgress);
    }

    pdf.save("tags.pdf");
    setIsGenerating(false);
  };

  return (
    <div
      style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}
      className="relative"
    >
      <button
        onClick={exportTagsToPDF}
        disabled={isGenerating}
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          color: "black",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          opacity: isGenerating ? 0.7 : 1,
        }}
        className={`${
          order_id ? "block" : "hidden"
        }  top-0 absolute right-4 bg-yellow-200 hover:bg-yellow-300 duration-75 ease-in`}
      >
        {isGenerating ? "Generating..." : "Download Tags"}
      </button>

      {/* Progress bar */}
      {isGenerating && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#f0f0f0",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "10px",
              backgroundColor: "#4CAF50",
              transition: "width 0.3s",
            }}
          ></div>
          <div
            style={{
              textAlign: "center",
              padding: "5px",
              fontSize: "14px",
            }}
          >
            Generating PDF: {progress}% complete
          </div>
        </div>
      )}

      <div ref={containerRef} className="font-extrabold ">
        {csvData?.map((tag, i) => (
          <div key={i} className="tag-label" style={tagStyle}>
            <p className="text-xs">
              Brand Name : Qurvii 
              
            </p>
            <p className="text-xs"> SKU : {`${tag.style_number}-${tag.color}-${tag.size}`}  </p>
            <p className="text-xs">
              Product:{" "}
              {(() => {
                const product = products.find(
                  (p) => p.style_code === Number(tag.style_number)
                );
                if (!product) return "N/A";
                return product.style_name.length > 25
                  ? `${product.style_name.substring(0, 25)}...`
                  : product.style_name;
              })()}
            </p>
            <p className="text-xs">
              Color: {tag.color} | Size: {tag.size}
            </p>
            <p className="text-xs">
              MRP: ₹{tag.mrp || "5333"} (Incl. of all taxes)
            </p>
            <p className="text-xs">Net Qty: 1 | Unit: 1 Pcs</p>
            <p className="text-xs">
              MFG & MKT BY: Qurvii,2nd Floor,B-149
              <br />
              Sector-6,  Noida, UP, 201301
            </p>
            <p className="text-xs">Contact : support@qurvii.com</p>
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
              }}
            >
              <QRCodeSVG
                value={order_id?.[i]?.order_id?.toString() || "542365"}
                size={80}
                level="H"
              />
            </div>
            <div className="absolute right-4 bottom-15">
              Id : {order_id?.[i]?.order_id?.toString() || "542365"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagPDFGenerator;
