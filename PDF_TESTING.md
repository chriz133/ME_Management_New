# PDF Generation Testing Guide

This guide provides instructions for testing the new backend-based PDF generation feature.

## Prerequisites

1. **Backend Server**: The .NET backend must be running
   ```bash
   cd server
   dotnet run --project Server.Api
   ```

2. **Frontend Client**: The Angular frontend must be running
   ```bash
   cd client
   npm start
   ```

3. **Authentication**: You must be logged in (default credentials: admin/admin or user/user)

4. **Test Data**: You need at least one invoice and one contract in the database

## Testing Invoice PDFs

### Test 1: View Invoice PDF
1. Navigate to the Invoices list page
2. Click on any invoice to open the detail view
3. Click the **"PDF Ansehen"** (View PDF) button
4. Verify:
   - PDF opens in a new browser tab
   - Success toast notification appears
   - PDF contains:
     - Company name and logo (if available)
     - Customer information
     - Invoice number and metadata
     - Positions table with proper formatting
     - Calculations (net, VAT, total)
     - Footer with bank information

### Test 2: Download Invoice PDF
1. Navigate to an invoice detail page
2. Click the **"PDF Herunterladen"** (Download PDF) button
3. Verify:
   - PDF downloads automatically
   - Success toast notification appears
   - Filename format: `{InvoiceID}_Rechnung_{Surname}_{Firstname}_{Date}.pdf`
   - PDF file opens correctly in PDF reader

### Test 3: Invoice Types
Test both invoice types to ensure proper handling:

**Type D (Dienstleistung - Service)**:
- Should show VAT calculation (20%)
- Should show deposit deduction if applicable
- Tax notice: "Zahlbar nach Erhalt der Rechnung"

**Type B (Bauleistung - Construction)**:
- Should NOT show VAT calculation
- Bold netto amount
- Tax notice: "Es wird darauf hingewiesen, dass die Steuerschuld gem. § 19 Abs. 1a UStG auf den Leistungsempfänger übergeht"

### Test 4: Multiple Positions
1. Test an invoice with multiple positions (5+ items)
2. Verify alternating row colors for better readability
3. Check that all positions are properly displayed

### Test 5: Deposit Handling
1. Test an invoice with a deposit amount
2. Verify:
   - Deposit amount is deducted from total
   - Deposit date is displayed
   - VAT for deposit is calculated and shown
   - Final "Restbetrag" is correct

## Testing Contract PDFs

### Test 1: View Contract PDF
1. Navigate to the Contracts list page
2. Click on any contract to open the detail view
3. Click the **"PDF Ansehen"** (View PDF) button
4. Verify:
   - PDF opens in a new browser tab
   - Success toast notification appears
   - PDF contains:
     - Company name (if logo is present)
     - Customer information
     - Contract number and metadata
     - Contract status (Accepted/Pending)
     - Positions table with amber/orange headers
     - Calculations (net, VAT, total)
     - "10 Tage gültig" validity notice
     - Footer with bank information

### Test 2: Download Contract PDF
1. Navigate to a contract detail page
2. Click the **"PDF Herunterladen"** (Download PDF) button
3. Verify:
   - PDF downloads automatically
   - Success toast notification appears
   - Filename format: `{ContractID}_Angebot_{Surname}_{Firstname}_{Date}.pdf`
   - PDF file opens correctly in PDF reader

### Test 3: Contract Status
Test contracts with different statuses:
- **Accepted**: Should show green "Angenommen" tag
- **Pending**: Should show orange "Ausstehend" tag

## Visual Testing

### Design Elements to Verify

**Invoices**:
- Blue primary color (#2563eb) in headers and totals
- Professional layout with proper spacing
- Clear, readable fonts
- Company information is prominent

**Contracts**:
- Amber/orange accent color (#f59e0b) in headers and totals
- Distinguished from invoices by color scheme
- Clear indication of validity period
- Status clearly visible

### Common Elements:
- Alternating row colors in position tables
- Professional footer with three columns
- Proper alignment of amounts (right-aligned)
- Consistent typography and spacing
- Modern, clean appearance

## Error Handling Testing

### Test 1: Invalid Invoice ID
1. Manually navigate to: `/api/invoices/999999/pdf`
2. Verify: 404 error with appropriate message

### Test 2: Invalid Contract ID
1. Manually navigate to: `/api/contracts/999999/pdf`
2. Verify: 404 error with appropriate message

### Test 3: Unauthorized Access
1. Log out
2. Try to access PDF endpoint directly
3. Verify: 401 Unauthorized response

## Browser Compatibility Testing

Test PDF generation in multiple browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

For each browser, verify:
- PDFs open correctly
- Download functionality works
- No console errors
- PDFs render properly

## Performance Testing

### Test 1: Simple Invoice
- Invoice with 1-3 positions
- Expected generation time: < 1 second

### Test 2: Complex Invoice
- Invoice with 10+ positions
- Expected generation time: < 2 seconds

### Test 3: Multiple Concurrent Requests
- Open 3-5 invoices in different tabs
- Generate PDFs simultaneously
- Verify all complete successfully

## API Endpoint Testing

You can also test the API endpoints directly using curl or Postman:

### Invoice PDF
```bash
curl -X GET \
  'http://localhost:5000/api/invoices/1/pdf' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --output invoice.pdf
```

### Contract PDF
```bash
curl -X GET \
  'http://localhost:5000/api/contracts/1/pdf' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --output contract.pdf
```

## Troubleshooting

### PDFs not generating
- Check backend logs for errors
- Verify database connection
- Ensure invoice/contract exists
- Check authentication token

### Layout issues
- PDFs are designed for A4 paper
- Very long text will wrap naturally
- Check that customer data is complete

### Download issues
- Check browser download settings
- Verify pop-up blocker settings
- Ensure sufficient disk space

## Success Criteria

A successful test should demonstrate:
- ✅ Both invoice and contract PDFs generate correctly
- ✅ PDFs can be viewed in browser and downloaded
- ✅ Visual design is professional and modern
- ✅ All calculations are accurate
- ✅ Error handling works properly
- ✅ Performance is acceptable (< 2 seconds)
- ✅ Works in all major browsers
- ✅ No console errors or warnings

## Reporting Issues

If you find any issues during testing, please report them with:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Screenshot of the PDF (if layout issue)
6. Browser console errors (if any)
