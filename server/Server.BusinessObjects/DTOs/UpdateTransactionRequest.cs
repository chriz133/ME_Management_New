using System;
using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for updating an existing transaction
/// </summary>
public class UpdateTransactionRequest
{
    [Required(ErrorMessage = "Betrag ist erforderlich")]
    public decimal Amount { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Datum ist erforderlich")]
    public DateTime Date { get; set; }

    [MaxLength(45)]
    public string? Type { get; set; }

    [MaxLength(45)]
    public string? Medium { get; set; }
}
