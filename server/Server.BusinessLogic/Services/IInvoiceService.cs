using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service interface for invoice business logic
/// </summary>
public interface IInvoiceService
{
    Task<IEnumerable<InvoiceDto>> GetAllAsync();
    Task<InvoiceDto?> GetByIdAsync(int id);
    Task<IEnumerable<InvoiceDto>> GetByCustomerIdAsync(int customerId);
    Task<InvoiceDto> CreateAsync(InvoiceCreateUpdateDto dto);
    Task<InvoiceDto?> UpdateAsync(int id, InvoiceCreateUpdateDto dto);
    Task<bool> DeleteAsync(int id);
    Task<byte[]?> GeneratePdfAsync(int id);
}
