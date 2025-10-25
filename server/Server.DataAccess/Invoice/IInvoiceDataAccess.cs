using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Invoice;

public interface IInvoiceDataAccess
{
    Task<IEnumerable<InvoiceEntity>> GetAllInvoicesAsync();
    Task<InvoiceEntity?> GetInvoiceByIdAsync(int invoiceId);
    Task<InvoiceEntity?> GetInvoiceWithPositionsAsync(int invoiceId);
    Task<IEnumerable<InvoiceEntity>> GetInvoicesByCustomerIdAsync(int customerId);
    Task<InvoiceEntity> CreateInvoiceAsync(InvoiceEntity invoice);
    Task UpdateInvoiceAsync(InvoiceEntity invoice);
    Task DeleteInvoiceAsync(InvoiceEntity invoice);
    Task<bool> CustomerExistsAsync(int customerId);
    Task<PositionEntity?> GetPositionByIdAsync(int positionId);
    Task<PositionEntity> CreatePositionAsync(PositionEntity position);
    Task SaveChangesAsync();
}
