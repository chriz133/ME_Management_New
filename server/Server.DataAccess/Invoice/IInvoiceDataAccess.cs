using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Invoice;

public interface IInvoiceDataAccess
{
    Task<IEnumerable<InvoiceEntity>> GetAllInvoicesAsync();
    Task<InvoiceEntity?> GetInvoiceByIdAsync(int invoiceId);
    Task<IEnumerable<InvoiceEntity>> GetInvoicesByCustomerIdAsync(int customerId);
    Task<InvoiceEntity> CreateInvoiceAsync(InvoiceEntity invoice);
    Task SaveChangesAsync();
}
