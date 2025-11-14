# PDF Generation Guide

This guide explains how to use the modern backend-based PDF generation functionality for invoices and contracts.

## Overview

The PDF generation feature uses **QuestPDF** on the .NET backend to create professional, high-quality PDF documents. Users can:
- **View PDFs**: Open generated PDFs in a new browser tab
- **Download PDFs**: Save PDFs to the local device
- **Automatic formatting**: Modern, professional layouts with consistent branding

## Features

### Invoice PDFs
- Modern blue color scheme with professional styling
- Company logo and comprehensive information
- Customer details (name, address, UID)
- Invoice metadata (number, date, service period, type)
- Position table with:
  - Descriptions, quantities, and prices
  - Alternating row colors for readability
  - Clear column headers
- Automatic calculations including:
  - Net amount (Nettobetrag)
  - VAT 20% (MwSt.) for service invoices (Type D)
  - Deposit deductions (Anzahlung) with date
  - Final amount (Restbetrag/Betrag)
- Professional footer with company details and bank information
- Tax notice for construction services (Bauleistung)

### Contract PDFs (Angebote)
- Modern amber/orange color scheme to distinguish from invoices
- Company logo and comprehensive information
- Customer details
- Contract metadata (number, date, status)
- Position table with calculations and alternating row colors
- Total calculations including:
  - Net amount
  - 20% VAT
  - Gross amount
- 10-day validity notice
- Professional footer with company details and bank information

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

## Technical Details

### Backend Technology
- **QuestPDF**: Modern, fluent API for PDF generation
- **.NET 8.0**: Backend API
- **C#**: Service implementation

### API Endpoints

#### Get Invoice PDF
```
GET /api/invoices/{id}/pdf
```

Returns a PDF file for the specified invoice.

Response:
- Content-Type: `application/pdf`
- File download with appropriate filename

#### Get Contract PDF
```
GET /api/contracts/{id}/pdf
```

Returns a PDF file for the specified contract.

Response:
- Content-Type: `application/pdf`
- File download with appropriate filename

### Frontend Integration
- **Angular Services**: InvoiceService and ContractService handle PDF requests
- **HTTP Client**: Uses blob response type for binary PDF data
- **File Download**: Programmatically creates download links

### Design Features
- **Modern Color Scheme**: 
  - Invoices: Blue primary color (#2563eb)
  - Contracts: Amber accent color (#f59e0b)
- **Typography**: Clear, readable font hierarchy
- **Layout**: Professional A4 format with proper margins
- **Tables**: Alternating row colors for improved readability
- **Branding**: Consistent company information across all PDFs

## Benefits Over Previous Implementation

### Quality
- Vector-based rendering for crisp, professional output
- Consistent formatting across all platforms
- No browser-specific rendering issues

### Performance
- Server-side generation is faster and more reliable
- Reduced client-side processing
- Smaller download sizes

### Maintainability
- Single source of truth for PDF layouts
- Easier to update and customize
- Type-safe C# implementation

## Browser Compatibility

The PDF generation works in all modern browsers:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari
- Opera

No special plugins or extensions required.

## Troubleshooting

### PDF Not Generating
- Check browser console for errors
- Ensure you're logged in and have proper permissions
- Verify the invoice/contract exists in the database
- Check backend logs for detailed error messages

### PDF Layout Issues
- PDFs are optimized for A4 paper size
- Very long position descriptions will wrap naturally
- The layout automatically handles multiple positions

### Download Issues
- Ensure pop-up blockers are not interfering
- Check browser download settings
- Verify sufficient disk space

## Future Enhancements

Possible future improvements:
- PDF email functionality
- Batch PDF generation for multiple invoices/contracts
- Custom PDF templates per customer
- PDF watermarks for draft versions
- Digital signatures
- Multi-language support
- Company logo customization via settings
