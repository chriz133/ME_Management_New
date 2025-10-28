namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Minimal customer DTO for list views - only includes name
/// </summary>
public class CustomerSummaryDto
{
    public int CustomerId { get; set; }
    public string? FullName { get; set; }
}
