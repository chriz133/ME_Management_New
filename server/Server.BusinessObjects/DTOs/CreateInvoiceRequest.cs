using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for creating a new invoice
/// </summary>
public class CreateInvoiceRequest
{
    [Required(ErrorMessage = "Kunde ist erforderlich")]
    public int CustomerId { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public decimal? DepositAmount { get; set; }

    public DateTime? DepositPaidOn { get; set; }

    [Required(ErrorMessage = "Typ ist erforderlich")]
    [RegularExpression("^[DB]$", ErrorMessage = "Typ muss 'D' oder 'B' sein")]
    public string Type { get; set; } = "D";

    [Required(ErrorMessage = "Mindestens eine Position ist erforderlich")]
    public List<CreateInvoicePositionRequest> Positions { get; set; } = new();
}

/// <summary>
/// Request model for invoice position
/// </summary>
public class CreateInvoicePositionRequest
{
    // Inline position data - will be created if PositionId is null/0
    public int? PositionId { get; set; }
    
    public string? Text { get; set; }
    
    public double? Price { get; set; }
    
    public string? Unit { get; set; }

    [Required(ErrorMessage = "Menge ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Menge muss größer als 0 sein")]
    public decimal Amount { get; set; }
}
