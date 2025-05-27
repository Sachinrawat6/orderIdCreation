// import React from 'react'
// import { QRCodeSVG } from "qrcode.react";
// const Tags = ({csvData,order_id}) => {
//   return (
//     <div className="w-full grid grid-cols-1 gap-2 container  max-w-100 mt-4 mx-auto">
//           {csvData?.map((tag, i) => {
//             return (
//               <div
//                 key={i}
//                 className="w-100 font-[Poppins] p-4 h-40 border relative border-gray-200 text-sm rounded-2xl"
//               >
//                 <p>Brand : Qurvii | Sku : {`${tag.style_number}-${tag.color}-${tag.size}`} </p>
//                 <p>Color : {tag.color} | Size : {tag.size} </p>
//                 <p>MRP : 5333 ( Incl. of all taxes )</p>
//                 <p>Net Qty : 1 | Unit : 1 Pcs</p>
//                 <p>
//                   MFG & MKT BY : Qurvii, 2nd Floor, B-149 Sector-6,  <br />
//                   Noida, UP, 201301{" "}
//                 </p>
//                 <div className=" absolute right-4 top-4">
//                   <QRCodeSVG
//                     value={
//                      order_id[i].order_id?.toString()||
//                        "542365"
//                     }
//                     size={80}
//                     level="H"
//                     includeMargin={false}
//                     className="border border-gray-100 p-1 rounded"
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//   )
// }

// export default Tags

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

const Tags = ({ csvData, order_id }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
                font:bold;
              }
              .tag-label {
                width: 378px;
                height: 170px;
                box-sizing: border-box;
                page-break-after: always;
              }
            }
            .tag-label {
              font-family: 'Poppins', sans-serif;
              font-size: 12px;
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 12px;
              position: relative;
              margin: 10px auto;
            }
            .qrcode {
              position: absolute;
              top: 10px;
              right: 10px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
        >
          🖨️ Print Tags
        </button>
      </div>

             {/* <div ref={printRef} className="w-full grid grid-cols-1 gap-2 container  max-w-100 mt-4 mx-auto">
        {csvData?.map((tag, i) => (
          <div className="tag-label relative border border-gray-200 p-4" key={i}>
            <p>
              Brand : Qurvii | Sku : {`${tag.style_number}-${tag.color}-${tag.size}`}
            </p>
            <p>Color : {tag.color} | Size : {tag.size}</p>
            <p>MRP :{`₹${tag.mrp} ` ||"₹5333"} (Incl. of all taxes)</p>
            <p>Net Qty : 1 | Unit : 1 Pcs</p>
            <p>
              MFG & MKT BY : Qurvii, 2nd Floor, B-149 Sector-6,
              <br />
              Noida, UP, 201301
            </p>
            <div className="qrcode absolute top-4 right-4">
              <QRCodeSVG
                value={order_id[i]?.order_id?.toString() || "542365"}
                size={80}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        ))}
      </div> */}
      <div
  ref={printRef}
  className="w-full grid grid-cols-1 gap-2 container max-w-screen-md mt-4 mx-auto"
>
  {csvData?.map((tag, i) => (
    <div
      key={i}
      className="tag-label relative border border-gray-300 py-6 px-4 font-bold"
      style={{
        width: '378px',
        height: '170px',
        boxSizing: 'border-box',
        pageBreakAfter: 'always',
      }}
    >
      <p className="text-sm font-bold">
        Brand: Qurvii | Sku: {`${tag.style_number}-${tag.color}-${tag.size}`}
      </p>
      <p className="text-sm">Color: {tag.color} | Size: {tag.size}</p>
      <p className="text-sm">
        MRP: ₹{tag.mrp || "5333"} (Incl. of all taxes)
      </p>
      <p className="text-sm">Net Qty: 1 | Unit: 1 Pcs</p>
      <p className="text-sm leading-tight">
        MFG & MKT BY: Qurvii, 2nd Floor, B-149 Sector-6,
        <br />
        Noida, UP, 201301
      </p>
      <div className="qrcode absolute top-5 right-4">
        <QRCodeSVG
          value={order_id[i]?.order_id?.toString() || "542365"}
          size={80}
          level="H"
          includeMargin={false}
        />
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Tags;
