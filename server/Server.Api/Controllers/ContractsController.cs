using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.DTOs;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContractsController> _logger;

    public ContractsController(ApplicationDbContext context, ILogger<ContractsController> logger)
    {
        _context = context;
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
            var contracts = await _context.ContractsDb
                .Include(c => c.Customer)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new ContractDto
                {
                    ContractId = c.ContractId,
                    CreatedAt = c.CreatedAt,
                    Accepted = c.Accepted,
                    CustomerId = c.CustomerId,
                    Customer = c.Customer == null ? null : new CustomerDto
                    {
                        CustomerId = c.Customer.CustomerId,
                        Firstname = c.Customer.Firstname,
                        Surname = c.Customer.Surname,
                        Plz = c.Customer.Plz,
                        City = c.Customer.City,
                        Address = c.Customer.Address,
                        Nr = c.Customer.Nr,
                        Uid = c.Customer.Uid
                    },
                    Positions = c.ContractPositions!.Select(cp => new ContractPositionDto
                    {
                        ContractPositionId = cp.ContractPositionId,
                        Amount = cp.Amount,
                        PositionId = cp.PositionId,
                        Position = cp.Position == null ? null : new PositionDto
                        {
                            PositionId = cp.Position.PositionId,
                            Text = cp.Position.Text,
                            Price = cp.Position.Price,
                            Unit = cp.Position.Unit
                        }
                    }).ToList()
                })
                .ToListAsync();
                
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching contracts");
            return StatusCode(500, new { message = "Error fetching contracts", error = ex.Message });
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
            var contract = await _context.ContractsDb
                .Include(c => c.Customer)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .Where(c => c.ContractId == id)
                .Select(c => new ContractDto
                {
                    ContractId = c.ContractId,
                    CreatedAt = c.CreatedAt,
                    Accepted = c.Accepted,
                    CustomerId = c.CustomerId,
                    Customer = c.Customer == null ? null : new CustomerDto
                    {
                        CustomerId = c.Customer.CustomerId,
                        Firstname = c.Customer.Firstname,
                        Surname = c.Customer.Surname,
                        Plz = c.Customer.Plz,
                        City = c.Customer.City,
                        Address = c.Customer.Address,
                        Nr = c.Customer.Nr,
                        Uid = c.Customer.Uid
                    },
                    Positions = c.ContractPositions!.Select(cp => new ContractPositionDto
                    {
                        ContractPositionId = cp.ContractPositionId,
                        Amount = cp.Amount,
                        PositionId = cp.PositionId,
                        Position = cp.Position == null ? null : new PositionDto
                        {
                            PositionId = cp.Position.PositionId,
                            Text = cp.Position.Text,
                            Price = cp.Position.Price,
                            Unit = cp.Position.Unit
                        }
                    }).ToList()
                })
                .FirstOrDefaultAsync();
                
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
}
