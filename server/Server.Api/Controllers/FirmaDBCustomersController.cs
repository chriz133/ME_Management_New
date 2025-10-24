using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FirmaDBCustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FirmaDBCustomersController> _logger;

    public FirmaDBCustomersController(ApplicationDbContext context, ILogger<FirmaDBCustomersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all customers from firmaDB
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerEntity>>> GetCustomers()
    {
        try
        {
            var customers = await _context.CustomersDb.ToListAsync();
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customers from firmaDB");
            return StatusCode(500, new { message = "Error fetching customers", error = ex.Message });
        }
    }

    /// <summary>
    /// Get customer by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerEntity>> GetCustomer(int id)
    {
        try
        {
            var customer = await _context.CustomersDb.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = $"Customer with ID {id} not found" });
            }
            return Ok(customer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer {CustomerId}", id);
            return StatusCode(500, new { message = "Error fetching customer", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all contracts for a specific customer
    /// </summary>
    [HttpGet("{id}/contracts")]
    public async Task<ActionResult<IEnumerable<ContractEntity>>> GetCustomerContracts(int id)
    {
        try
        {
            var contracts = await _context.ContractsDb
                .Where(c => c.CustomerId == id)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .ToListAsync();
                
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching contracts for customer {CustomerId}", id);
            return StatusCode(500, new { message = "Error fetching contracts", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all invoices for a specific customer
    /// </summary>
    [HttpGet("{id}/invoices")]
    public async Task<ActionResult<IEnumerable<InvoiceEntity>>> GetCustomerInvoices(int id)
    {
        try
        {
            var invoices = await _context.InvoicesDb
                .Where(i => i.CustomerId == id)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .ToListAsync();
                
            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices for customer {CustomerId}", id);
            return StatusCode(500, new { message = "Error fetching invoices", error = ex.Message });
        }
    }
}
