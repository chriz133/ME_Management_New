using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Contract;

namespace Server.BusinessLogic.Contract;

public class ContractBusinessLogic : IContractBusinessLogic
{
    private readonly IContractDataAccess _contractDataAccess;
    private readonly ILogger<ContractBusinessLogic> _logger;

    public ContractBusinessLogic(
        IContractDataAccess contractDataAccess,
        ILogger<ContractBusinessLogic> logger)
    {
        _contractDataAccess = contractDataAccess;
        _logger = logger;
    }

    public async Task<IEnumerable<ContractDto>> GetAllContractsAsync()
    {
        var contracts = await _contractDataAccess.GetAllContractsAsync();
        return contracts.Select(MapToDto);
    }

    public async Task<ContractDto?> GetContractByIdAsync(int contractId)
    {
        var contract = await _contractDataAccess.GetContractByIdAsync(contractId);
        return contract != null ? MapToDto(contract) : null;
    }

    public async Task<ContractDto> CreateContractAsync(CreateContractRequest request)
    {
        // Verify customer exists
        var customerExists = await _contractDataAccess.CustomerExistsAsync(request.CustomerId);
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
            PositionEntity? position;

            // Check if we need to create a new position or use an existing one
            if (positionRequest.PositionId.HasValue && positionRequest.PositionId.Value > 0)
            {
                // Use existing position
                position = await _contractDataAccess.GetPositionByIdAsync(positionRequest.PositionId.Value);
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
                
                position = await _contractDataAccess.CreatePositionAsync(position);
            }

            // Create contract position linking
            var contractPosition = new ContractPosition
            {
                Position = position,
                Amount = (double)positionRequest.Amount
            };

            contract.ContractPositions.Add(contractPosition);
        }

        // Save the contract
        var createdContract = await _contractDataAccess.CreateContractAsync(contract);
        _logger.LogInformation("Contract {ContractId} created successfully", createdContract.ContractId);

        // Fetch the complete contract with relationships
        var contractWithRelations = await _contractDataAccess.GetContractByIdAsync(createdContract.ContractId);
        
        return MapToDto(contractWithRelations!);
    }

    public async Task UpdateContractAsync(int contractId, bool accepted)
    {
        var contract = await _contractDataAccess.GetContractByIdAsync(contractId);
        if (contract == null)
        {
            throw new ArgumentException($"Contract with ID {contractId} not found");
        }

        contract.Accepted = accepted;
        await _contractDataAccess.UpdateContractAsync(contract);
        _logger.LogInformation("Contract {ContractId} updated", contractId);
    }

    public async Task DeleteContractAsync(int contractId)
    {
        var contract = await _contractDataAccess.GetContractWithPositionsAsync(contractId);
        if (contract == null)
        {
            throw new ArgumentException($"Contract with ID {contractId} not found");
        }

        await _contractDataAccess.DeleteContractAsync(contract);
        _logger.LogInformation("Contract {ContractId} deleted", contractId);
    }

    public async Task<CreateInvoiceRequest> GetContractForInvoiceConversionAsync(int contractId)
    {
        var contract = await _contractDataAccess.GetContractWithPositionsAsync(contractId);
        if (contract == null)
        {
            throw new ArgumentException($"Contract with ID {contractId} not found");
        }

        var invoiceRequest = new CreateInvoiceRequest
        {
            CustomerId = contract.CustomerId,
            StartedAt = DateTime.Now,
            FinishedAt = DateTime.Now,
            Type = "D",
            Positions = contract.ContractPositions?.Select(cp => new CreateInvoicePositionRequest
            {
                PositionId = cp.PositionId,
                Text = cp.Position?.Text,
                Price = cp.Position?.Price,
                Unit = cp.Position?.Unit,
                Amount = (decimal)cp.Amount
            }).ToList() ?? new List<CreateInvoicePositionRequest>()
        };

        return invoiceRequest;
    }

    private static ContractDto MapToDto(ContractEntity contract)
    {
        return new ContractDto
        {
            ContractId = contract.ContractId,
            CreatedAt = contract.CreatedAt,
            Accepted = contract.Accepted,
            CustomerId = contract.CustomerId,
            Customer = contract.Customer == null ? null : new CustomerDto
            {
                CustomerId = contract.Customer.CustomerId,
                Firstname = contract.Customer.Firstname,
                Surname = contract.Customer.Surname,
                Plz = contract.Customer.Plz,
                City = contract.Customer.City,
                Address = contract.Customer.Address,
                Nr = contract.Customer.Nr,
                Uid = contract.Customer.Uid
            },
            Positions = contract.ContractPositions?.Select(cp => new ContractPositionDto
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
            }).ToList() ?? new List<ContractPositionDto>()
        };
    }
}
