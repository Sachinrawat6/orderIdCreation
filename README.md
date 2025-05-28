# UploadAndSyncWithOrderId Component

## 📦 Overview

The `UploadAndSyncWithOrderId` React component is designed for a workflow that allows users to:

1. **Select a category/channel** (e.g., "Return" or "New").
2. **Upload a CSV file** containing order or inventory data.
3. **Parse and validate the CSV data** using PapaParse.
4. **Send the parsed orders to a backend API** (`https://fastapi.qurvii.com/sync-orders`) to synchronize them.
5. **Generate tag PDFs** using the returned order data via the `TagPDFGenerator` component.

---

## 🚀 Features

- Category-based order segregation (`Return` or `New`).
- CSV parsing with data validation and transformation.
- Integration with an API endpoint for syncing order data.
- Real-time UI feedback (loading indicators, success/failure messages).
- Tag generation with PDF export support.

---

## 🧩 Dependencies

```bash
npm install react papaparse axios react-router-dom
