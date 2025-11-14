namespace Server.BusinessLogic.Pdf;

/// <summary>
/// Service for generating PDF documents
/// </summary>
public interface IPdfService
{
    /// <summary>
    /// Generate a PDF for an invoice
    /// </summary>
    /// <param name="invoiceId">The ID of the invoice to generate PDF for</param>
    /// <returns>PDF document as byte array</returns>
    Task<byte[]> GenerateInvoicePdfAsync(int invoiceId);

    /// <summary>
    /// Generate a PDF for a contract
    /// </summary>
    /// <param name="contractId">The ID of the contract to generate PDF for</param>
    /// <returns>PDF document as byte array</returns>
    Task<byte[]> GenerateContractPdfAsync(int contractId);
}
