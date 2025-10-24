using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Repositories;

/// <summary>
/// Repository implementation for Invoice with eager loading of related entities
/// </summary>
public class InvoiceRepository : Repository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Invoice?> GetByIdAsync(int id)
    {
        return await GetByIdWithDetailsAsync(id);
    }

    public async Task<Invoice?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(i => i.Customer)
            .Include(i => i.LineItems)
            .Include(i => i.Contract)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public override async Task<IEnumerable<Invoice>> GetAllAsync()
    {
        return await _dbSet
            .Include(i => i.Customer)
            .Include(i => i.LineItems)
            .OrderByDescending(i => i.InvoiceDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invoice>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(i => i.Customer)
            .Include(i => i.LineItems)
            .Where(i => i.CustomerId == customerId)
            .OrderByDescending(i => i.InvoiceDate)
            .ToListAsync();
    }

    public async Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber)
    {
        return await _dbSet
            .Include(i => i.Customer)
            .Include(i => i.LineItems)
            .FirstOrDefaultAsync(i => i.InvoiceNumber == invoiceNumber);
    }
}
