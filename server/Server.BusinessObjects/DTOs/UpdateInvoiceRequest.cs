using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for updating an invoice
/// </summary>
public class UpdateInvoiceRequest
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
