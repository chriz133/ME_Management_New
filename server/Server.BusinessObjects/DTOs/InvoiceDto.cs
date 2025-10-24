namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for invoice information from firmaDB
/// </summary>
public class InvoiceDto
{
    public int InvoiceId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CustomerId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime FinishedAt { get; set; }
    public double DepositAmount { get; set; }
    public DateTime DepositPaidOn { get; set; }
    public string? Type { get; set; }
    public CustomerDto? Customer { get; set; }
    public List<InvoicePositionDto>? Positions { get; set; }
    public double TotalAmount => Positions?.Sum(p => p.Amount * (p.Position?.Price ?? 0)) ?? 0;
}

/// <summary>
/// DTO for invoice position from firmaDB
/// </summary>
public class InvoicePositionDto
{
    public int InvoicePositionId { get; set; }
    public double Amount { get; set; }
    public int PositionId { get; set; }
    public PositionDto? Position { get; set; }
    public double LineTotal => Amount * (Position?.Price ?? 0);
}
