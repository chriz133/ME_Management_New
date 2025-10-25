namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for contract information
/// </summary>
public class ContractDto
{
    public int ContractId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Accepted { get; set; }
    public int CustomerId { get; set; }
    public CustomerDto? Customer { get; set; }
    public List<ContractPositionDto>? Positions { get; set; }
}

/// <summary>
/// DTO for contract position
/// </summary>
public class ContractPositionDto
{
    public int ContractPositionId { get; set; }
    public double Amount { get; set; }
    public int PositionId { get; set; }
    public PositionDto? Position { get; set; }
}
