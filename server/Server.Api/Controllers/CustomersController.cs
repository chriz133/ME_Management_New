using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Customer;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerBusinessLogic _customerBusinessLogic;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ICustomerBusinessLogic customerBusinessLogic, ILogger<CustomersController> logger)
    {
        _customerBusinessLogic = customerBusinessLogic;
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
            var customers = await _customerBusinessLogic.GetAllCustomersAsync();
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
            var customer = await _customerBusinessLogic.GetCustomerByIdAsync(id);
                
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
            var contracts = await _customerBusinessLogic.GetCustomerContractsAsync(id);
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
            var invoices = await _customerBusinessLogic.GetCustomerInvoicesAsync(id);
            return Ok(invoices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching invoices for customer {CustomerId}", id);
            return StatusCode(500, new { message = "Error fetching invoices", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new customer (requires Admin or User role)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<CustomerDto>> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        try
        {
            var customerDto = await _customerBusinessLogic.CreateCustomerAsync(request);
            return CreatedAtAction(nameof(GetCustomer), new { id = customerDto.CustomerId }, customerDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer");
            return StatusCode(500, new { message = "Error creating customer", error = ex.Message });
        }
    }
}
