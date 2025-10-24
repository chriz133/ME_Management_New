using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Services;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

/// <summary>
/// Controller for customer management operations.
/// All endpoints require authentication.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ICustomerService customerService, ILogger<CustomersController> logger)
    {
        _customerService = customerService;
        _logger = logger;
    }

    /// <summary>
    /// Get all customers
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CustomerDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll()
    {
        var customers = await _customerService.GetAllAsync();
        return Ok(customers);
    }

    /// <summary>
    /// Get a specific customer by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDto>> GetById(int id)
    {
        var customer = await _customerService.GetByIdAsync(id);
        
        if (customer == null)
        {
            return NotFound();
        }

        return Ok(customer);
    }

    /// <summary>
    /// Create a new customer
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerDto>> Create([FromBody] CustomerCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var customer = await _customerService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }

    /// <summary>
    /// Update an existing customer
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CustomerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CustomerDto>> Update(int id, [FromBody] CustomerCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var customer = await _customerService.UpdateAsync(id, dto);
        
        if (customer == null)
        {
            return NotFound();
        }

        return Ok(customer);
    }

    /// <summary>
    /// Delete a customer
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _customerService.DeleteAsync(id);
        
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
