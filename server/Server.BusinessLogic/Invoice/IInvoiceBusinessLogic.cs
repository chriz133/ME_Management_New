using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Invoice;

public interface IInvoiceBusinessLogic
{
    Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync();
    Task<InvoiceDto?> GetInvoiceByIdAsync(int invoiceId);
    Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceRequest request);
    Task<InvoiceDto> UpdateInvoiceAsync(int invoiceId, UpdateInvoiceRequest request);
    Task DeleteInvoiceAsync(int invoiceId);
    Task<int> GetInvoicesCountAsync();
    Task<IEnumerable<InvoiceSummaryDto>> GetAllInvoicesSummaryAsync();
}
