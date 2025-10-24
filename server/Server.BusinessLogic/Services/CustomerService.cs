using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Repositories;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service implementation for customer business logic.
/// Handles data transformation between entities and DTOs.
/// </summary>
public class CustomerService : ICustomerService
{
    private readonly IRepository<Customer> _customerRepository;

    public CustomerService(IRepository<Customer> customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync()
    {
        var customers = await _customerRepository.GetAllAsync();
        return customers.Select(MapToDto);
    }

    public async Task<CustomerDto?> GetByIdAsync(int id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        return customer == null ? null : MapToDto(customer);
    }

    public async Task<CustomerDto> CreateAsync(CustomerCreateUpdateDto dto)
    {
        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City,
            PostalCode = dto.PostalCode,
            Country = dto.Country,
            TaxId = dto.TaxId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _customerRepository.AddAsync(customer);
        return MapToDto(created);
    }

    public async Task<CustomerDto?> UpdateAsync(int id, CustomerCreateUpdateDto dto)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null)
        {
            return null;
        }

        customer.Name = dto.Name;
        customer.Email = dto.Email;
        customer.Phone = dto.Phone;
        customer.Address = dto.Address;
        customer.City = dto.City;
        customer.PostalCode = dto.PostalCode;
        customer.Country = dto.Country;
        customer.TaxId = dto.TaxId;
        customer.UpdatedAt = DateTime.UtcNow;

        var updated = await _customerRepository.UpdateAsync(customer);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exists = await _customerRepository.ExistsAsync(id);
        if (!exists)
        {
            return false;
        }

        await _customerRepository.DeleteAsync(id);
        return true;
    }

    private static CustomerDto MapToDto(Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            Address = customer.Address,
            City = customer.City,
            PostalCode = customer.PostalCode,
            Country = customer.Country,
            TaxId = customer.TaxId,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };
    }
}
