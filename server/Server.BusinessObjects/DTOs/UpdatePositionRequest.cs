using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for updating an existing position
/// </summary>
public class UpdatePositionRequest
{
    [Required(ErrorMessage = "Text ist erforderlich")]
    public string Text { get; set; } = string.Empty;

    [Required(ErrorMessage = "Preis ist erforderlich")]
    [Range(0, double.MaxValue, ErrorMessage = "Preis muss größer oder gleich 0 sein")]
    public double Price { get; set; }

    [Required(ErrorMessage = "Einheit ist erforderlich")]
    public string Unit { get; set; } = string.Empty;
}
