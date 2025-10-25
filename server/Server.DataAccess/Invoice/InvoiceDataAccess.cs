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

    public async Task<bool> CustomerExistsAsync(int customerId)
    {
        return await _context.CustomersDb.AnyAsync(c => c.CustomerId == customerId);
    }

    public async Task<PositionEntity?> GetPositionByIdAsync(int positionId)
    {
        return await _context.PositionsDb.FindAsync(positionId);
    }

    public async Task<PositionEntity> CreatePositionAsync(PositionEntity position)
    {
        _context.PositionsDb.Add(position);
        await _context.SaveChangesAsync();
        return position;
    }

    public async Task<InvoiceEntity?> GetInvoiceWithPositionsAsync(int invoiceId)
    {
        return await _context.InvoicesDb
            .Include(i => i.InvoicePositions)
                .ThenInclude(ip => ip.Position)
            .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
    }

    public async Task UpdateInvoiceAsync(InvoiceEntity invoice)
    {
        _context.InvoicesDb.Update(invoice);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteInvoiceAsync(InvoiceEntity invoice)
    {
        // Remove invoice positions first if they exist
        if (invoice.InvoicePositions != null)
        {
            _context.InvoicePositions.RemoveRange(invoice.InvoicePositions);
        }
        
        _context.InvoicesDb.Remove(invoice);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
