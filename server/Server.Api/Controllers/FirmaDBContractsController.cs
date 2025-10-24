using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FirmaDBContractsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FirmaDBContractsController> _logger;

    public FirmaDBContractsController(ApplicationDbContext context, ILogger<FirmaDBContractsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all contracts from firmaDB
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractEntity>>> GetContracts()
    {
        try
        {
            var contracts = await _context.ContractsDb
                .Include(c => c.Customer)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
                
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching contracts from firmaDB");
            return StatusCode(500, new { message = "Error fetching contracts", error = ex.Message });
        }
    }

    /// <summary>
    /// Get contract by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ContractEntity>> GetContract(int id)
    {
        try
        {
            var contract = await _context.ContractsDb
                .Include(c => c.Customer)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .FirstOrDefaultAsync(c => c.ContractId == id);
                
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
    /// Get contract positions for a specific contract
    /// </summary>
    [HttpGet("{id}/positions")]
    public async Task<ActionResult<IEnumerable<ContractPosition>>> GetContractPositions(int id)
    {
        try
        {
            var positions = await _context.ContractPositions
                .Include(cp => cp.Position)
                .Where(cp => cp.ContractId == id)
                .ToListAsync();
                
            return Ok(positions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching positions for contract {ContractId}", id);
            return StatusCode(500, new { message = "Error fetching contract positions", error = ex.Message });
        }
    }
}
