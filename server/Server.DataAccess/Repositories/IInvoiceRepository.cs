using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Repositories;

/// <summary>
/// Repository interface for Invoice with additional query methods
/// </summary>
public interface IInvoiceRepository : IRepository<Invoice>
{
    Task<Invoice?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Invoice>> GetByCustomerIdAsync(int customerId);
    Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber);
}
