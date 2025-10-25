namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for position (service/product) information
/// </summary>
public class PositionDto
{
    public int PositionId { get; set; }
    public string? Text { get; set; }
    public double Price { get; set; }
    public string? Unit { get; set; }
}
