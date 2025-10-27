using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Invoice;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceBusinessLogic _invoiceBusinessLogic;
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(
        IInvoiceBusinessLogic invoiceBusinessLogic,
        ILogger<InvoicesController> logger)
    {
        _invoiceBusinessLogic = invoiceBusinessLogic;
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
            var invoices = await _invoiceBusinessLogic.GetAllInvoicesAsync();
            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices");
            return StatusCode(500, new { message = "Error fetching invoices", error = ex.Message });
        }
    }

    /// <summary>
    /// Get all invoices with summary data (optimized for list views)
    /// </summary>
    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<InvoiceSummaryDto>>> GetInvoicesSummary()
    {
        try
        {
            var invoices = await _invoiceBusinessLogic.GetAllInvoicesSummaryAsync();
            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices summary");
            return StatusCode(500, new { message = "Error fetching invoices summary", error = ex.Message });
        }
    }

    /// <summary>
    /// Get count of all invoices
    /// </summary>
    [HttpGet("count")]
    public async Task<ActionResult<EntityCountDto>> GetInvoicesCount()
    {
        try
        {
            var count = await _invoiceBusinessLogic.GetInvoicesCountAsync();
            return Ok(new EntityCountDto { Count = count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices count");
            return StatusCode(500, new { message = "Error fetching invoices count", error = ex.Message });
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
            var invoice = await _invoiceBusinessLogic.GetInvoiceByIdAsync(id);
                
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
            var createdInvoice = await _invoiceBusinessLogic.CreateInvoiceAsync(request);
            return CreatedAtAction(nameof(GetInvoice), new { id = createdInvoice.InvoiceId }, createdInvoice);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating invoice");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating invoice");
            return StatusCode(500, new { message = "Error creating invoice", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing invoice (requires Admin or User role)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<InvoiceDto>> UpdateInvoice(int id, [FromBody] UpdateInvoiceRequest request)
    {
        try
        {
            var invoiceDto = await _invoiceBusinessLogic.UpdateInvoiceAsync(id, request);
            return Ok(invoiceDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invoice {InvoiceId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating invoice {InvoiceId}", id);
            return StatusCode(500, new { message = "Error updating invoice", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete an invoice (requires Admin role only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteInvoice(int id)
    {
        try
        {
            await _invoiceBusinessLogic.DeleteInvoiceAsync(id);
            _logger.LogInformation("Invoice {InvoiceId} deleted by admin", id);
            return Ok(new { message = "Invoice deleted successfully" });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invoice {InvoiceId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting invoice {InvoiceId}", id);
            return StatusCode(500, new { message = "Error deleting invoice", error = ex.Message });
        }
    }
}
