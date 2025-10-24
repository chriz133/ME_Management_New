using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.DTOs;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(ApplicationDbContext context, ILogger<InvoicesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all invoices
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetInvoices()
    {
        try
        {
            var invoices = await _context.InvoicesDb
                .Include(i => i.Customer)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .OrderByDescending(i => i.CreatedAt)
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
                    Customer = i.Customer == null ? null : new CustomerDto
                    {
                        CustomerId = i.Customer.CustomerId,
                        Firstname = i.Customer.Firstname,
                        Surname = i.Customer.Surname,
                        Plz = i.Customer.Plz,
                        City = i.Customer.City,
                        Address = i.Customer.Address,
                        Nr = i.Customer.Nr,
                        Uid = i.Customer.Uid
                    },
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
            _logger.LogError(ex, "Error fetching invoices");
            return StatusCode(500, new { message = "Error fetching invoices", error = ex.Message });
        }
    }

    /// <summary>
    /// Get invoice by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceDto>> GetInvoice(int id)
    {
        try
        {
            var invoice = await _context.InvoicesDb
                .Include(i => i.Customer)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .Where(i => i.InvoiceId == id)
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
                    Customer = i.Customer == null ? null : new CustomerDto
                    {
                        CustomerId = i.Customer.CustomerId,
                        Firstname = i.Customer.Firstname,
                        Surname = i.Customer.Surname,
                        Plz = i.Customer.Plz,
                        City = i.Customer.City,
                        Address = i.Customer.Address,
                        Nr = i.Customer.Nr,
                        Uid = i.Customer.Uid
                    },
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
                .FirstOrDefaultAsync();
                
            if (invoice == null)
            {
                return NotFound(new { message = $"Invoice with ID {id} not found" });
            }
            
            return Ok(invoice);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoice {InvoiceId}", id);
            return StatusCode(500, new { message = "Error fetching invoice", error = ex.Message });
        }
    }
}
