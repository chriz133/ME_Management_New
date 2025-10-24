using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.DTOs;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ApplicationDbContext context, ILogger<CustomersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all customers
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
    {
        try
        {
            var customers = await _context.CustomersDb
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    Firstname = c.Firstname,
                    Surname = c.Surname,
                    Plz = c.Plz,
                    City = c.City,
                    Address = c.Address,
                    Nr = c.Nr,
                    Uid = c.Uid
                })
                .ToListAsync();
                
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customers");
            return StatusCode(500, new { message = "Error fetching customers", error = ex.Message });
        }
    }

    /// <summary>
    /// Get customer by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
    {
        try
        {
            var customer = await _context.CustomersDb
                .Where(c => c.CustomerId == id)
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    Firstname = c.Firstname,
                    Surname = c.Surname,
                    Plz = c.Plz,
                    City = c.City,
                    Address = c.Address,
                    Nr = c.Nr,
                    Uid = c.Uid
                })
                .FirstOrDefaultAsync();
                
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
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetCustomerContracts(int id)
    {
        try
        {
            var contracts = await _context.ContractsDb
                .Where(c => c.CustomerId == id)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .Select(c => new ContractDto
                {
                    ContractId = c.ContractId,
                    CreatedAt = c.CreatedAt,
                    Accepted = c.Accepted,
                    CustomerId = c.CustomerId,
                    Positions = c.ContractPositions!.Select(cp => new ContractPositionDto
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
                    }).ToList()
                })
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
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetCustomerInvoices(int id)
    {
        try
        {
            var invoices = await _context.InvoicesDb
                .Where(i => i.CustomerId == id)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .Select(i => new InvoiceDto
                {
                    InvoiceId = i.InvoiceId,
                    CreatedAt = i.CreatedAt,
                    CustomerId = i.CustomerId,
                    StartedAt = i.StartedAt,
                    FinishedAt = i.FinishedAt,
                    DepositAmount = i.DepositAmount,
                    DepositPaidOn = i.DepositPaidOn,
                    Type = i.Type,
                    Positions = i.InvoicePositions!.Select(ip => new InvoicePositionDto
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
                    }).ToList()
                })
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
