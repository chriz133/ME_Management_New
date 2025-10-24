using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Repositories;

/// <summary>
/// Repository interface for Offer with additional query methods
/// </summary>
public interface IOfferRepository : IRepository<Offer>
{
    Task<Offer?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Offer>> GetByCustomerIdAsync(int customerId);
    Task<Offer?> GetByOfferNumberAsync(string offerNumber);
}
