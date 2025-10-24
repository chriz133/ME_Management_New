using Server.BusinessObjects.Entities;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service interface for PDF generation
/// </summary>
public interface IPdfService
{
    byte[] GenerateInvoicePdf(Invoice invoice);
    byte[] GenerateOfferPdf(Offer offer);
}
