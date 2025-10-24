using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Services;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

/// <summary>
/// Controller for offer (Angebot) management operations.
/// All endpoints require authentication.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OffersController : ControllerBase
{
    private readonly IOfferService _offerService;
    private readonly ILogger<OffersController> _logger;

    public OffersController(IOfferService offerService, ILogger<OffersController> logger)
    {
        _offerService = offerService;
        _logger = logger;
    }

    /// <summary>
    /// Get all offers
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<OfferDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OfferDto>>> GetAll()
    {
        var offers = await _offerService.GetAllAsync();
        return Ok(offers);
    }

    /// <summary>
    /// Get a specific offer by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(OfferDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OfferDto>> GetById(int id)
    {
        var offer = await _offerService.GetByIdAsync(id);
        
        if (offer == null)
        {
            return NotFound();
        }

        return Ok(offer);
    }

    /// <summary>
    /// Get offers for a specific customer
    /// </summary>
    [HttpGet("customer/{customerId}")]
    [ProducesResponseType(typeof(IEnumerable<OfferDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<OfferDto>>> GetByCustomerId(int customerId)
    {
        var offers = await _offerService.GetByCustomerIdAsync(customerId);
        return Ok(offers);
    }

    /// <summary>
    /// Create a new offer
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(OfferDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OfferDto>> Create([FromBody] OfferCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var offer = await _offerService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = offer.Id }, offer);
    }

    /// <summary>
    /// Update an existing offer
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(OfferDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OfferDto>> Update(int id, [FromBody] OfferCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var offer = await _offerService.UpdateAsync(id, dto);
        
        if (offer == null)
        {
            return NotFound();
        }

        return Ok(offer);
    }

    /// <summary>
    /// Delete an offer
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _offerService.DeleteAsync(id);
        
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    /// <summary>
    /// Generate and download PDF for an offer.
    /// Returns the PDF file as binary data.
    /// </summary>
    [HttpGet("{id}/pdf")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPdf(int id)
    {
        var pdfBytes = await _offerService.GeneratePdfAsync(id);
        
        if (pdfBytes == null)
        {
            return NotFound();
        }

        var offer = await _offerService.GetByIdAsync(id);
        var fileName = $"Angebot_{offer!.OfferNumber}.pdf";

        return File(pdfBytes, "application/pdf", fileName);
    }
}
