using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Customer;

public class CustomerDataAccess : ICustomerDataAccess
{
    private readonly ApplicationDbContext _context;

    public CustomerDataAccess(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CustomerEntity>> GetAllCustomersAsync()
    {
        return await _context.CustomersDb.ToListAsync();
    }

    public async Task<CustomerEntity?> GetCustomerByIdAsync(int customerId)
    {
        return await _context.CustomersDb.FindAsync(customerId);
    }

    public async Task<CustomerEntity> CreateCustomerAsync(CustomerEntity customer)
    {
        _context.CustomersDb.Add(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task<bool> CustomerExistsAsync(int customerId)
    {
        return await _context.CustomersDb.AnyAsync(c => c.CustomerId == customerId);
    }
}
