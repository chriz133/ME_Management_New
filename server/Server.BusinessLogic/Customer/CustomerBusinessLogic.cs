using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Customer;

namespace Server.BusinessLogic.Customer;

public class CustomerBusinessLogic : ICustomerBusinessLogic
{
    private readonly ICustomerDataAccess _customerDataAccess;
    private readonly ILogger<CustomerBusinessLogic> _logger;

    public CustomerBusinessLogic(
        ICustomerDataAccess customerDataAccess,
        ILogger<CustomerBusinessLogic> logger)
    {
        _customerDataAccess = customerDataAccess;
        _logger = logger;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
    {
        var customers = await _customerDataAccess.GetAllCustomersAsync();
        return customers.Select(MapToDto);
    }

    public async Task<CustomerDto?> GetCustomerByIdAsync(int customerId)
    {
        var customer = await _customerDataAccess.GetCustomerByIdAsync(customerId);
        return customer != null ? MapToDto(customer) : null;
    }

    public async Task<IEnumerable<ContractDto>> GetCustomerContractsAsync(int customerId)
    {
        var contracts = await _customerDataAccess.GetCustomerContractsAsync(customerId);
        return contracts.Select(MapContractToDto);
    }

    public async Task<IEnumerable<InvoiceDto>> GetCustomerInvoicesAsync(int customerId)
    {
        var invoices = await _customerDataAccess.GetCustomerInvoicesAsync(customerId);
        return invoices.Select(MapInvoiceToDto);
    }

    public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerRequest request)
    {
        var customer = new CustomerEntity
        {
            Firstname = request.Firstname,
            Surname = request.Surname,
            Plz = request.Plz,
            City = request.City,
            Address = request.Address,
            Nr = request.Nr,
            Uid = request.Uid
        };

        var createdCustomer = await _customerDataAccess.CreateCustomerAsync(customer);
        _logger.LogInformation("Customer {CustomerId} created", createdCustomer.CustomerId);
        
        return MapToDto(createdCustomer);
    }

    public async Task<CustomerDto> UpdateCustomerAsync(int customerId, UpdateCustomerRequest request)
    {
        var customer = await _customerDataAccess.GetCustomerByIdAsync(customerId);
        if (customer == null)
        {
            throw new ArgumentException($"Customer with ID {customerId} not found");
        }

        customer.Firstname = request.Firstname;
        customer.Surname = request.Surname;
        customer.Plz = request.Plz;
        customer.City = request.City;
        customer.Address = request.Address;
        customer.Nr = request.Nr;
        customer.Uid = request.Uid;

        var updatedCustomer = await _customerDataAccess.UpdateCustomerAsync(customer);
        _logger.LogInformation("Customer {CustomerId} updated", updatedCustomer.CustomerId);

        return MapToDto(updatedCustomer);
    }

    public async Task DeleteCustomerAsync(int customerId)
    {
        var exists = await _customerDataAccess.CustomerExistsAsync(customerId);
        if (!exists)
        {
            throw new ArgumentException($"Customer with ID {customerId} not found");
        }

        await _customerDataAccess.DeleteCustomerAsync(customerId);
        _logger.LogInformation("Customer {CustomerId} deleted", customerId);
    }

    private static CustomerDto MapToDto(CustomerEntity customer)
    {
        return new CustomerDto
        {
            CustomerId = customer.CustomerId,
            Firstname = customer.Firstname,
            Surname = customer.Surname,
            Plz = customer.Plz,
            City = customer.City,
            Address = customer.Address,
            Nr = customer.Nr,
            Uid = customer.Uid
        };
    }

    private static ContractDto MapContractToDto(ContractEntity contract)
    {
        return new ContractDto
        {
            ContractId = contract.ContractId,
            CreatedAt = contract.CreatedAt,
            Accepted = contract.Accepted,
            CustomerId = contract.CustomerId,
            Customer = contract.Customer == null ? null : MapToDto(contract.Customer),
            Positions = contract.ContractPositions?.Select(cp => new ContractPositionDto
            {
                ContractPositionId = cp.ContractPositionId,
                Amount = cp.Amount,
                PositionId = cp.PositionId,
                Position = cp.Position == null ? null : new PositionDto
                {
                    PositionId = cp.Position.PositionId,
                    Text = cp.Position.Text,
                    Price = cp.Position.Price,
                    Unit = cp.Position.Unit
                }
            }).ToList() ?? new List<ContractPositionDto>()
        };
    }

    private static InvoiceDto MapInvoiceToDto(InvoiceEntity invoice)
    {
        return new InvoiceDto
        {
            InvoiceId = invoice.InvoiceId,
            CreatedAt = invoice.CreatedAt,
            CustomerId = invoice.CustomerId,
            StartedAt = invoice.StartedAt,
            FinishedAt = invoice.FinishedAt,
            DepositAmount = invoice.DepositAmount,
            DepositPaidOn = invoice.DepositPaidOn,
            Type = invoice.Type,
            Customer = invoice.Customer == null ? null : MapToDto(invoice.Customer),
            Positions = invoice.InvoicePositions?.Select(ip => new InvoicePositionDto
            {
                InvoicePositionId = ip.InvoicePositionId,
                Amount = ip.Amount,
                PositionId = ip.PositionId,
                Position = ip.Position == null ? null : new PositionDto
                {
                    PositionId = ip.Position.PositionId,
                    Text = ip.Position.Text,
                    Price = ip.Position.Price,
                    Unit = ip.Position.Unit
                }
            }).ToList() ?? new List<InvoicePositionDto>()
        };
    }
}
