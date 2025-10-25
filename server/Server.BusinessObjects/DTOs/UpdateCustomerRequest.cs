using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for updating an existing customer
/// </summary>
public class UpdateCustomerRequest
{
    [Required(ErrorMessage = "Vorname ist erforderlich")]
    [MaxLength(45)]
    public string Firstname { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nachname ist erforderlich")]
    [MaxLength(45)]
    public string Surname { get; set; } = string.Empty;

    public int? Plz { get; set; }

    [MaxLength(45)]
    public string? City { get; set; }

    [MaxLength(45)]
    public string? Address { get; set; }

    public int? Nr { get; set; }

    [MaxLength(45)]
    public string? Uid { get; set; }
}
