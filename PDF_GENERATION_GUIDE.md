# PDF Generation Guide

This guide explains how to use the PDF generation functionality for invoices and contracts.

## Overview

The PDF generation feature allows users to:
- **View PDFs**: Open generated PDFs in a new browser tab
- **Download PDFs**: Save PDFs to the local device
- **Multi-page support**: Automatically handles documents that exceed one page

## Features

### Invoice PDFs
- Company logo and information
- Customer details (name, address, UID)
- Invoice metadata (number, date, service period)
- Position table with descriptions, quantities, and prices
- Automatic calculations including:
  - Net amount (Nettobetrag)
  - VAT 20% (MwSt.) for service invoices (Type D)
  - Deposit deductions (Anzahlung)
  - Final amount (Restbetrag/Betrag)
- Footer with company details and bank information

### Contract PDFs (Angebote)
- Company logo and information
- Customer details
- Contract metadata (number, date)
- Position table with calculations
- Total calculations including net amount, VAT, and gross amount
- 10-day validity notice
- Footer with company details and bank information

## How to Use

### Viewing PDFs

1. Navigate to an invoice or contract detail page
2. Click the **"PDF Ansehen"** (View PDF) button
3. The PDF will open in a new browser tab
4. You can print or save from the browser

### Downloading PDFs

1. Navigate to an invoice or contract detail page
2. Click the **"PDF Herunterladen"** (Download PDF) button
3. The PDF will be automatically downloaded to your device
4. Filename format:
   - Invoices: `{InvoiceID}_Rechnung_{Surname}_{Firstname}_{Date}.pdf`
   - Contracts: `{ContractID}_Angebot_{Surname}_{Firstname}_{Date}.pdf`

## Configuration

PDF save paths can be configured in the backend settings:

### Backend Configuration (appsettings.json)

```json
{
  "PdfSettings": {
    "InvoiceSavePath": "./PDFs/Invoices",
    "ContractSavePath": "./PDFs/Contracts"
  }
}
```

You can customize these paths to match your deployment environment. The paths support:
- Relative paths (e.g., `./PDFs/Invoices`)
- Absolute paths (e.g., `/var/app/pdfs/invoices`)
- Windows paths (e.g., `C:\\PDFs\\Invoices`)
- Unix paths (e.g., `/home/user/pdfs/invoices`)

## Technical Details

### Libraries Used
- **jsPDF**: PDF generation library
- **html2canvas**: HTML to canvas conversion for PDF rendering

### Multi-page Handling
The PDF service automatically detects when content exceeds one A4 page and splits it into multiple pages. This ensures that invoices or contracts with many positions are properly formatted across multiple pages.

### Browser Compatibility
The PDF generation works in all modern browsers that support:
- HTML5 Canvas API
- Blob API
- Download attribute on anchor tags

## Troubleshooting

### PDF Not Generating
- Check browser console for errors
- Ensure you have the latest version of the application
- Try a different browser

### PDF Layout Issues
- The PDF layout is optimized for A4 paper size
- Very long position descriptions may wrap to multiple lines
- Company logo must be present in `/assets/images/logo_v1.png`

### Multi-page PDFs
- If positions exceed 15 items, the PDF will automatically span multiple pages
- Each page maintains proper header and footer formatting
- Page breaks occur naturally based on content height

## API Endpoints

### Get PDF Settings
```
GET /api/system/pdf-settings
```

Returns the configured PDF save paths for invoices and contracts.

Response:
```json
{
  "invoiceSavePath": "./PDFs/Invoices",
  "contractSavePath": "./PDFs/Contracts"
}
```

## Future Enhancements

Possible future improvements:
- PDF email functionality
- Batch PDF generation
- Custom PDF templates
- PDF watermarks
- Digital signatures
