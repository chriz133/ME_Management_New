using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Invoice;
using Server.BusinessLogic.Pdf;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceBusinessLogic _invoiceBusinessLogic;
    private readonly IPdfService _pdfService;
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(
        IInvoiceBusinessLogic invoiceBusinessLogic,
        IPdfService pdfService,
        ILogger<InvoicesController> logger)
    {
        _invoiceBusinessLogic = invoiceBusinessLogic;
        _pdfService = pdfService;
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
    /// Generate and download PDF for an invoice
    /// </summary>
    [HttpGet("{id}/pdf")]
    public async Task<IActionResult> GetInvoicePdf(int id)
    {
        try
        {
            var invoice = await _invoiceBusinessLogic.GetInvoiceByIdAsync(id);
            if (invoice == null)
            {
                return NotFound(new { message = $"Invoice with ID {id} not found" });
            }

            var pdfBytes = await _pdfService.GenerateInvoicePdfAsync(id);
            
            var customerName = $"{invoice.Customer?.Surname}_{invoice.Customer?.Firstname}".Replace(" ", "_");
            var fileName = $"{id:D5}_Rechnung_{customerName}_{invoice.CreatedAt:yyyy-MM-dd}.pdf";
            
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating PDF for invoice {InvoiceId}", id);
            return StatusCode(500, new { message = "Error generating PDF", error = ex.Message });
        }
    }
}
