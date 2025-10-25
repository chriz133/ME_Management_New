using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Customer;

public interface ICustomerBusinessLogic
{
    Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
    Task<CustomerDto?> GetCustomerByIdAsync(int customerId);
    Task<IEnumerable<ContractDto>> GetCustomerContractsAsync(int customerId);
    Task<IEnumerable<InvoiceDto>> GetCustomerInvoicesAsync(int customerId);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerRequest request);
    Task<CustomerDto> UpdateCustomerAsync(int customerId, UpdateCustomerRequest request);
    Task DeleteCustomerAsync(int customerId);
}
