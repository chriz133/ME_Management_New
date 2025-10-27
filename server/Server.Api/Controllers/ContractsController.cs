using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Contract;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly IContractBusinessLogic _contractBusinessLogic;
    private readonly ILogger<ContractsController> _logger;

    public ContractsController(
        IContractBusinessLogic contractBusinessLogic,
        ILogger<ContractsController> logger)
    {
        _contractBusinessLogic = contractBusinessLogic;
        _logger = logger;
    }

    /// <summary>
    /// Get all contracts
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetContracts()
    {
        try
        {
            var contracts = await _contractBusinessLogic.GetAllContractsAsync();
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching contracts");
            return StatusCode(500, new { message = "Error fetching contracts", error = ex.Message });
        }
    }

    /// <summary>
    /// Get count of all contracts
    /// </summary>
    [HttpGet("count")]
    public async Task<ActionResult<EntityCountDto>> GetContractsCount()
    {
        try
        {
            var count = await _contractBusinessLogic.GetContractsCountAsync();
            return Ok(new EntityCountDto { Count = count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching contracts count");
            return StatusCode(500, new { message = "Error fetching contracts count", error = ex.Message });
        }
    }

    /// <summary>
    /// Get contract by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ContractDto>> GetContract(int id)
    {
        try
        {
            var contract = await _contractBusinessLogic.GetContractByIdAsync(id);
                
            if (contract == null)
            {
                return NotFound(new { message = $"Contract with ID {id} not found" });
            }
            
            return Ok(contract);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching contract {ContractId}", id);
            return StatusCode(500, new { message = "Error fetching contract", error = ex.Message });
        }
    }

    /// <summary>
    /// Update contract (requires User or Admin role)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<ContractDto>> UpdateContract(int id, [FromBody] UpdateContractRequest request)
    {
        try
        {
            var contractDto = await _contractBusinessLogic.UpdateContractAsync(id, request);
            _logger.LogInformation("Contract {ContractId} updated by user", id);
            return Ok(contractDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Contract {ContractId} not found or validation error", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating contract {ContractId}", id);
            return StatusCode(500, new { message = "Error updating contract", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete contract (requires Admin role only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteContract(int id)
    {
        try
        {
            await _contractBusinessLogic.DeleteContractAsync(id);
            _logger.LogInformation("Contract {ContractId} deleted by admin", id);
            return Ok(new { message = "Contract deleted successfully" });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Contract {ContractId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting contract {ContractId}", id);
            return StatusCode(500, new { message = "Error deleting contract", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new contract (requires Admin or User role)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<ContractDto>> CreateContract([FromBody] CreateContractRequest request)
    {
        try
        {
            var createdContract = await _contractBusinessLogic.CreateContractAsync(request);
            return CreatedAtAction(nameof(GetContract), new { id = createdContract.ContractId }, createdContract);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating contract");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating contract");
            return StatusCode(500, new { message = "Error creating contract", error = ex.Message });
        }
    }

    /// <summary>
    /// Get contract data for converting to invoice (pre-fills invoice form)
    /// </summary>
    [HttpGet("{id}/convert-to-invoice")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<CreateInvoiceRequest>> GetContractForInvoiceConversion(int id)
    {
        try
        {
            var invoiceRequest = await _contractBusinessLogic.GetContractForInvoiceConversionAsync(id);
            return Ok(invoiceRequest);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Contract {ContractId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error converting contract {ContractId} to invoice", id);
            return StatusCode(500, new { message = "Error converting contract to invoice", error = ex.Message });
        }
    }
}
