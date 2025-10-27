namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for contract list views with minimal data (no position details)
/// </summary>
public class ContractSummaryDto
{
    public int ContractId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Accepted { get; set; }
    public int CustomerId { get; set; }
    public CustomerDto? Customer { get; set; }
    public int PositionCount { get; set; }
}
