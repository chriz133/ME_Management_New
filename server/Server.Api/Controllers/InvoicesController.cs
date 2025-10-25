using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
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

    /// <summary>
    /// Create a new invoice (requires Admin or User role)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<InvoiceDto>> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        try
        {
            // Verify customer exists
            var customerExists = await _context.CustomersDb.AnyAsync(c => c.CustomerId == request.CustomerId);
            if (!customerExists)
            {
                return BadRequest(new { message = $"Customer with ID {request.CustomerId} not found" });
            }

            // Verify all positions exist
            var positionIds = request.Positions.Select(p => p.PositionId).ToList();
            var existingPositionIds = await _context.PositionsDb
                .Where(p => positionIds.Contains(p.PositionId))
                .Select(p => p.PositionId)
                .ToListAsync();

            var missingPositions = positionIds.Except(existingPositionIds).ToList();
            if (missingPositions.Any())
            {
                return BadRequest(new { message = $"Positions not found: {string.Join(", ", missingPositions)}" });
            }

            var invoice = new InvoiceEntity
            {
                CreatedAt = DateTime.Now,
                CustomerId = request.CustomerId,
                StartedAt = request.StartedAt ?? DateTime.Now,
                FinishedAt = request.FinishedAt ?? DateTime.Now,
                DepositAmount = (double)(request.DepositAmount ?? 0),
                DepositPaidOn = request.DepositPaidOn ?? DateTime.Now,
                Type = request.Type,
                InvoicePositions = request.Positions.Select(p => new InvoicePosition
                {
                    PositionId = p.PositionId,
                    Amount = (double)p.Amount
                }).ToList()
            };

            _context.InvoicesDb.Add(invoice);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Invoice {InvoiceId} created", invoice.InvoiceId);

            // Fetch the created invoice with all relationships
            var createdInvoice = await _context.InvoicesDb
                .Include(i => i.Customer)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .Where(i => i.InvoiceId == invoice.InvoiceId)
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

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.InvoiceId }, createdInvoice);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating invoice");
            return StatusCode(500, new { message = "Error creating invoice", error = ex.Message });
        }
    }
}
