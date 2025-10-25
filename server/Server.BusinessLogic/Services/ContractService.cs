using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.BusinessLogic.Services;

public class ContractService : IContractService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContractService> _logger;

    public ContractService(ApplicationDbContext context, ILogger<ContractService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<ContractDto> CreateContractAsync(CreateContractRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            // Verify customer exists
            var customerExists = await _context.CustomersDb.AnyAsync(c => c.CustomerId == request.CustomerId);
            if (!customerExists)
            {
                throw new ArgumentException($"Customer with ID {request.CustomerId} not found");
            }

            // Create the contract entity
            var contract = new ContractEntity
            {
                CreatedAt = DateTime.Now,
                Accepted = request.Accepted,
                CustomerId = request.CustomerId,
                ContractPositions = new List<ContractPosition>()
            };

            // Process each position
            foreach (var positionRequest in request.Positions)
            {
                PositionEntity position;

                // Check if we need to create a new position or use an existing one
                if (positionRequest.PositionId.HasValue && positionRequest.PositionId.Value > 0)
                {
                    // Use existing position
                    position = await _context.PositionsDb.FindAsync(positionRequest.PositionId.Value);
                    if (position == null)
                    {
                        throw new ArgumentException($"Position with ID {positionRequest.PositionId} not found");
                    }
                }
                else
                {
                    // Create new position inline
                    if (string.IsNullOrWhiteSpace(positionRequest.Text) || 
                        !positionRequest.Price.HasValue || 
                        string.IsNullOrWhiteSpace(positionRequest.Unit))
                    {
                        throw new ArgumentException("Position data (Text, Price, Unit) is required when PositionId is not provided");
                    }

                    position = new PositionEntity
                    {
                        Text = positionRequest.Text,
                        Price = positionRequest.Price.Value,
                        Unit = positionRequest.Unit
                    };
                    
                    _context.PositionsDb.Add(position);
                    await _context.SaveChangesAsync(); // Save to get the ID
                }

                // Create contract position linking
                var contractPosition = new ContractPosition
                {
                    Position = position,  // Use navigation property instead of ID
                    Amount = (double)positionRequest.Amount
                };

                contract.ContractPositions.Add(contractPosition);
            }

            // Save the contract
            _context.ContractsDb.Add(contract);
            await _context.SaveChangesAsync();
            
            await transaction.CommitAsync();

            _logger.LogInformation("Contract {ContractId} created successfully", contract.ContractId);

            // Fetch and return the complete contract with relationships
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
                .FirstAsync();

            return createdContract;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error creating contract");
            throw;
        }
    }
}
