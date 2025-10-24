using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service interface for offer business logic
/// </summary>
public interface IOfferService
{
    Task<IEnumerable<OfferDto>> GetAllAsync();
    Task<OfferDto?> GetByIdAsync(int id);
    Task<IEnumerable<OfferDto>> GetByCustomerIdAsync(int customerId);
    Task<OfferDto> CreateAsync(OfferCreateUpdateDto dto);
    Task<OfferDto?> UpdateAsync(int id, OfferCreateUpdateDto dto);
    Task<bool> DeleteAsync(int id);
    Task<byte[]?> GeneratePdfAsync(int id);
}
