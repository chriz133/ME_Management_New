using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Services;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

/// <summary>
/// Controller for invoice (Rechnung) management operations.
/// All endpoints require authentication.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _invoiceService;
    private readonly ILogger<InvoicesController> _logger;

    public InvoicesController(IInvoiceService invoiceService, ILogger<InvoicesController> logger)
    {
        _invoiceService = invoiceService;
        _logger = logger;
    }

    /// <summary>
    /// Get all invoices
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<InvoiceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetAll()
    {
        var invoices = await _invoiceService.GetAllAsync();
        return Ok(invoices);
    }

    /// <summary>
    /// Get a specific invoice by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(InvoiceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InvoiceDto>> GetById(int id)
    {
        var invoice = await _invoiceService.GetByIdAsync(id);
        
        if (invoice == null)
        {
            return NotFound();
        }

        return Ok(invoice);
    }

    /// <summary>
    /// Get invoices for a specific customer
    /// </summary>
    [HttpGet("customer/{customerId}")]
    [ProducesResponseType(typeof(IEnumerable<InvoiceDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetByCustomerId(int customerId)
    {
        var invoices = await _invoiceService.GetByCustomerIdAsync(customerId);
        return Ok(invoices);
    }

    /// <summary>
    /// Create a new invoice
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(InvoiceDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InvoiceDto>> Create([FromBody] InvoiceCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var invoice = await _invoiceService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, invoice);
    }

    /// <summary>
    /// Update an existing invoice
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(InvoiceDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InvoiceDto>> Update(int id, [FromBody] InvoiceCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var invoice = await _invoiceService.UpdateAsync(id, dto);
        
        if (invoice == null)
        {
            return NotFound();
        }

        return Ok(invoice);
    }

    /// <summary>
    /// Delete an invoice
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _invoiceService.DeleteAsync(id);
        
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    /// <summary>
    /// Generate and download PDF for an invoice.
    /// Returns the PDF file as binary data.
    /// </summary>
    [HttpGet("{id}/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPdf(int id)
    {
        var pdfBytes = await _invoiceService.GeneratePdfAsync(id);
        
        if (pdfBytes == null)
        {
            return NotFound();
        }

        var invoice = await _invoiceService.GetByIdAsync(id);
        var fileName = $"Rechnung_{invoice!.InvoiceNumber}.pdf";

        return File(pdfBytes, "application/pdf", fileName);
    }
}
