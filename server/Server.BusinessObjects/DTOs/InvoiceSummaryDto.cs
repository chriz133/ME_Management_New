namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for invoice list views with minimal data (no position details)
/// </summary>
public class InvoiceSummaryDto
{
    public int InvoiceId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CustomerId { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime FinishedAt { get; set; }
    public double DepositAmount { get; set; }
    public DateTime DepositPaidOn { get; set; }
    public string? Type { get; set; }
    public CustomerSummaryDto? Customer { get; set; }
    public int PositionCount { get; set; }
    public double TotalAmount { get; set; }
}
