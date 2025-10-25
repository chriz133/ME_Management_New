using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Invoice;

public class InvoiceDataAccess : IInvoiceDataAccess
{
    private readonly ApplicationDbContext _context;

    public InvoiceDataAccess(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InvoiceEntity>> GetAllInvoicesAsync()
    {
        return await _context.InvoicesDb
            .Include(i => i.Customer)
            .Include(i => i.InvoicePositions)
                .ThenInclude(ip => ip.Position)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<InvoiceEntity?> GetInvoiceByIdAsync(int invoiceId)
    {
        return await _context.InvoicesDb
            .Include(i => i.Customer)
            .Include(i => i.InvoicePositions)
                .ThenInclude(ip => ip.Position)
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
    }

    public async Task<IEnumerable<InvoiceEntity>> GetInvoicesByCustomerIdAsync(int customerId)
    {
        return await _context.InvoicesDb
            .Where(i => i.CustomerId == customerId)
            .Include(i => i.InvoicePositions)
                .ThenInclude(ip => ip.Position)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<InvoiceEntity> CreateInvoiceAsync(InvoiceEntity invoice)
    {
        _context.InvoicesDb.Add(invoice);
        await _context.SaveChangesAsync();
        return invoice;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
