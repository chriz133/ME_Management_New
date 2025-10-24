using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
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

    /// <summary>
    /// Update contract acceptance status (requires User or Admin role)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult> UpdateContract(int id, [FromBody] UpdateContractRequest request)
    {
        try
        {
            var contract = await _context.ContractsDb.FindAsync(id);
            if (contract == null)
            {
                return NotFound(new { message = $"Contract with ID {id} not found" });
            }

            contract.Accepted = request.Accepted;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Contract {ContractId} updated by user", id);
            return Ok(new { message = "Contract updated successfully" });
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
            var contract = await _context.ContractsDb
                .Include(c => c.ContractPositions)
                .FirstOrDefaultAsync(c => c.ContractId == id);
                
            if (contract == null)
            {
                return NotFound(new { message = $"Contract with ID {id} not found" });
            }

            // Remove contract positions first
            if (contract.ContractPositions != null)
            {
                _context.ContractPositions.RemoveRange(contract.ContractPositions);
            }
            
            _context.ContractsDb.Remove(contract);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Contract {ContractId} deleted by admin", id);
            return Ok(new { message = "Contract deleted successfully" });
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
            // Verify customer exists
            var customerExists = await _context.CustomersDb.AnyAsync(c => c.CustomerId == request.CustomerId);
            if (!customerExists)
            {
                return BadRequest(new { message = $"Customer with ID {request.CustomerId} not found" });
            }

            // Verify all positions exist
            var positionIds = request.Positions.Select(p => p.PositionId).ToList();
            var existingPositionIds = await _context.PositionsDb
                .Where(p => positionIds.Contains(p.PositionId))
                .Select(p => p.PositionId)
                .ToListAsync();

            var missingPositions = positionIds.Except(existingPositionIds).ToList();
            if (missingPositions.Any())
            {
                return BadRequest(new { message = $"Positions not found: {string.Join(", ", missingPositions)}" });
            }

            var contract = new ContractEntity
            {
                CreatedAt = DateTime.Now,
                Accepted = request.Accepted,
                CustomerId = request.CustomerId,
                ContractPositions = request.Positions.Select(p => new ContractPosition
                {
                    PositionId = p.PositionId,
                    Amount = (double)p.Amount
                }).ToList()
            };

            _context.ContractsDb.Add(contract);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Contract {ContractId} created", contract.ContractId);

            // Fetch the created contract with all relationships
            var createdContract = await _context.ContractsDb
                .Include(c => c.Customer)
                .Include(c => c.ContractPositions)
                    .ThenInclude(cp => cp.Position)
                .Where(c => c.ContractId == contract.ContractId)
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

            return CreatedAtAction(nameof(GetContract), new { id = contract.ContractId }, createdContract);
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
            var contract = await _context.ContractsDb
                .Include(c => c.ContractPositions)
                .FirstOrDefaultAsync(c => c.ContractId == id);

            if (contract == null)
            {
                return NotFound(new { message = $"Contract with ID {id} not found" });
            }

            var invoiceRequest = new CreateInvoiceRequest
            {
                CustomerId = contract.CustomerId,
                StartedAt = DateTime.Now,
                FinishedAt = DateTime.Now,
                Type = "D",
                Positions = contract.ContractPositions!.Select(cp => new CreateInvoicePositionRequest
                {
                    PositionId = cp.PositionId,
                    Amount = (decimal)cp.Amount
                }).ToList()
            };

            return Ok(invoiceRequest);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error converting contract {ContractId} to invoice", id);
            return StatusCode(500, new { message = "Error converting contract to invoice", error = ex.Message });
        }
    }
}

/// <summary>
/// Request model for updating contract
/// </summary>
public class UpdateContractRequest
{
    public bool Accepted { get; set; }
}
