using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FirmaDBInvoicesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FirmaDBInvoicesController> _logger;

    public FirmaDBInvoicesController(ApplicationDbContext context, ILogger<FirmaDBInvoicesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all invoices from firmaDB
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvoiceEntity>>> GetInvoices()
    {
        try
        {
            var invoices = await _context.InvoicesDb
                .Include(i => i.Customer)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
                
            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices from firmaDB");
            return StatusCode(500, new { message = "Error fetching invoices", error = ex.Message });
        }
    }

    /// <summary>
    /// Get invoice by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceEntity>> GetInvoice(int id)
    {
        try
        {
            var invoice = await _context.InvoicesDb
                .Include(i => i.Customer)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .FirstOrDefaultAsync(i => i.InvoiceId == id);
                
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
    /// Get invoice positions for a specific invoice
    /// </summary>
    [HttpGet("{id}/positions")]
    public async Task<ActionResult<IEnumerable<InvoicePosition>>> GetInvoicePositions(int id)
    {
        try
        {
            var positions = await _context.InvoicePositions
                .Include(ip => ip.Position)
                .Where(ip => ip.InvoiceId == id)
                .ToListAsync();
                
            return Ok(positions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching positions for invoice {InvoiceId}", id);
            return StatusCode(500, new { message = "Error fetching invoice positions", error = ex.Message });
        }
    }
}
