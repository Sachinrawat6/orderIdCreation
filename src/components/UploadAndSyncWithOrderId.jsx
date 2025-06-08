import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";

import Tags from "./Tags";
import { Link } from "react-router-dom";
import TagPDFGenerator from "./TagPDFGenerator";

const UploadAndSyncWithOrderId = () => {
  const [csvData, setCsvData] = useState([]);
  const [product, setProductsData] = useState([]);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [channel, setChannel] = useState("");

  // Fetch MRP data from product API
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setMessage("");
    setResponse(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      // complete: function (results) {
      //   const parsedData = results.data.map((row) => {
      //     // const styleNumber = row["Sku Code"]?.toString().trim() || "" || row["Sku Id"].split("-")[0];
      //     const styleNumber = row["Sku Code"]?.toString().trim() || row["Sku Id"]?.toString().split("-")[0] || "";
      //     // const mrp = row['MRP'] || 0;
      //     const mrp = row['MRP'] || "" || product.find((p)=>p.sku_code===Number(styleNumber))?.MRP;
      //     const quantity = row['Qty'] ||  row["Good"] || 1;

      //     return {
      //       channel: channel || "",
      //       style_number: Number(styleNumber.split("-")[0]),
      //       size: row["Size"]?.trim()  || row["Sku Id"]?.toString().split("-")[2] || "",
      //       mrp,
      //       quantity,
      //       color: row["Color"]?.trim() || row["Sku Id"]?.toString().split("-")[1] || "",
      //       found_in_inventory:
      //         typeof row["Found In Inventory"] === "string" &&
      //         row["Found In Inventory"].toLowerCase().trim() === "yes",
      //     };
      //   });

      //   setCsvData(parsedData);
      //   setMessage(`📄 ${parsedData.length} records loaded from CSV`);
      // },
      complete: function (results) {
        const allData = [];

        results.data.forEach((row) => {
          const styleNumber =
            row["Sku Code"]?.toString().trim() ||
            row["Sku Id"]?.toString().split("-")[0] ||
            "";
          const mrp =
            row["MRP"] ||
            product.find((p) => p.style_code === Number(styleNumber))?.mrp ||
            "";
          const quantity = parseInt(row["Qty"] || row["Good"] || 1, 10);

          const size =
            row["Size"]?.trim() ||
            row["Sku Id"]?.toString().split("-")[2] ||
            "";
          const color =
            row["Color"]?.trim() ||
            row["Sku Id"]?.toString().split("-")[1] ||
            "";
          const found =
            typeof row["Found In Inventory"] === "string" &&
            row["Found In Inventory"].toLowerCase().trim() === "yes";

          for (let i = 0; i < quantity; i++) {
            allData.push({
              channel: channel || "",
              style_number: Number(styleNumber.split("-")[0]),
              size,
              mrp,
              quantity: 1, // each record = 1 item
              color,
              found_in_inventory: found,
            });
          }
        });

        setCsvData(allData);
        setMessage(`📄 ${allData.length} records loaded from CSV`);
      },

      error: function (error) {
        setMessage(`❌ Error parsing CSV: ${error.message}`);
      },
    });
  };

  const syncOrders = async () => {
    if (csvData.length === 0) {
      setMessage("❌ No data to sync");
      return;
    }

    const validOrders = csvData.filter(
      (order) =>
        order.channel && order.style_number && order.size && order.color
    );

    if (validOrders.length === 0) {
      setMessage("❌ No valid orders found (missing required fields)");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("🔄 Syncing orders...");

      const res = await axios.post("https://fastapi.qurvii.com/sync-orders", [
        ...validOrders,
      ]);

      setResponse(res.data);
      setMessage(`✅ Successfully synced ${res.data.all_orders.length} orders`);
    } catch (error) {
      console.error("Error from API:", error.response?.data || error.message);
      setMessage(
        `❌ Failed to sync orders: ${
          error.response?.data?.detail || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Order Synchronization & Tag Generation
          </h2>

          <div className="my-4">
            <div className="relative">
              <select
                onChange={(e) => setChannel(e.target.value)}
                // onChange={(e)=>console.log(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="">Select Category</option>
                <option value="Return">Return</option>
                <option value="New">New</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`space-y-6 ${channel.length > 0 ? "block" : "hidden"} `}
        >
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition hover:border-blue-400">
            <div className="flex flex-col items-center justify-center space-y-3">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  {fileName ? "Change File" : "Select CSV File"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {fileName && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: <span className="font-medium">{fileName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={syncOrders}
              disabled={csvData.length === 0 || isLoading}
              className={`flex items-center justify-center px-6 py-3 rounded-md font-medium text-white transition duration-200 ${
                csvData.length > 0 && channel.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } ${isLoading ? "opacity-75" : ""}`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Generate Tags"
              )}
            </button>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.includes("✅")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : message.includes("❌")
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              <div className="flex items-center">
                {message.includes("✅") ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : message.includes("❌") ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span>{message}</span>

                {console.log(csvData)}
              </div>
            </div>
          )}
          <div
            className={`${
              response?.all_orders[0].order_id ? "block" : "hidden"
            } h-55  overflow-auto`}
          >
            <TagPDFGenerator
              csvData={csvData}
              order_id={response?.all_orders}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadAndSyncWithOrderId;
