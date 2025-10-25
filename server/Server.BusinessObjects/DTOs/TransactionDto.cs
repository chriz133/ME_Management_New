namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for transaction information
/// </summary>
public class TransactionDto
{
    public int TransactionId { get; set; }
    public double Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public string? Type { get; set; }
    public string? Medium { get; set; }
}
