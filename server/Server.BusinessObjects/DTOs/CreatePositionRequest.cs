using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for creating a new position (service/product)
/// </summary>
public class CreatePositionRequest
{
    [Required(ErrorMessage = "Text ist erforderlich")]
    [MaxLength(500)]
    public string Text { get; set; } = string.Empty;

    [Required(ErrorMessage = "Preis ist erforderlich")]
    [Range(0, double.MaxValue, ErrorMessage = "Preis muss größer oder gleich 0 sein")]
    public decimal Price { get; set; }

    [MaxLength(45)]
    public string? Unit { get; set; }
}
