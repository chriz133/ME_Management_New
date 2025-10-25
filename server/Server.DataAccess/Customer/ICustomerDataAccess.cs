using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Customer;

public interface ICustomerDataAccess
{
    Task<IEnumerable<CustomerEntity>> GetAllCustomersAsync();
    Task<CustomerEntity?> GetCustomerByIdAsync(int customerId);
    Task<CustomerEntity> CreateCustomerAsync(CustomerEntity customer);
    Task UpdateCustomerAsync(CustomerEntity customer);
    Task DeleteCustomerAsync(CustomerEntity customer);
    Task<bool> CustomerExistsAsync(int customerId);
    Task<IEnumerable<ContractEntity>> GetCustomerContractsAsync(int customerId);
    Task<IEnumerable<InvoiceEntity>> GetCustomerInvoicesAsync(int customerId);
}
