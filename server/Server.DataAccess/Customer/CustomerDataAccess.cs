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

    public async Task<IEnumerable<ContractEntity>> GetCustomerContractsAsync(int customerId)
    {
        return await _context.ContractsDb
            .Where(c => c.CustomerId == customerId)
            .Include(c => c.ContractPositions)
                .ThenInclude(cp => cp.Position)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<InvoiceEntity>> GetCustomerInvoicesAsync(int customerId)
    {
        return await _context.InvoicesDb
            .Where(i => i.CustomerId == customerId)
            .Include(i => i.InvoicePositions)
                .ThenInclude(ip => ip.Position)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<CustomerEntity> UpdateCustomerAsync(CustomerEntity customer)
    {
        _context.CustomersDb.Update(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    public async Task DeleteCustomerAsync(int customerId)
    {
        var customer = await _context.CustomersDb.FindAsync(customerId);
        if (customer != null)
        {
            _context.CustomersDb.Remove(customer);
            await _context.SaveChangesAsync();
        }
    }
}
