using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service interface for customer business logic
/// </summary>
public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetAllAsync();
    Task<CustomerDto?> GetByIdAsync(int id);
    Task<CustomerDto> CreateAsync(CustomerCreateUpdateDto dto);
    Task<CustomerDto?> UpdateAsync(int id, CustomerCreateUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
