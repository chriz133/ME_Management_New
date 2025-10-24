using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Repositories;

/// <summary>
/// Repository implementation for Offer with eager loading of related entities
/// </summary>
public class OfferRepository : Repository<Offer>, IOfferRepository
{
    public OfferRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Offer?> GetByIdAsync(int id)
    {
        return await GetByIdWithDetailsAsync(id);
    }

    public async Task<Offer?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public override async Task<IEnumerable<Offer>> GetAllAsync()
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.LineItems)
            .OrderByDescending(o => o.OfferDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Offer>> GetByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.LineItems)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.OfferDate)
            .ToListAsync();
    }

    public async Task<Offer?> GetByOfferNumberAsync(string offerNumber)
    {
        return await _dbSet
            .Include(o => o.Customer)
            .Include(o => o.LineItems)
            .FirstOrDefaultAsync(o => o.OfferNumber == offerNumber);
    }
}
