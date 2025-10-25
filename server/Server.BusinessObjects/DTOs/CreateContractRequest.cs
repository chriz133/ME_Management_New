using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for creating a new contract
/// </summary>
public class CreateContractRequest
{
    [Required(ErrorMessage = "Kunde ist erforderlich")]
    public int CustomerId { get; set; }

    public bool Accepted { get; set; }

    [Required(ErrorMessage = "Mindestens eine Position ist erforderlich")]
    public List<CreateContractPositionRequest> Positions { get; set; } = new();
}

/// <summary>
/// Request model for contract position
/// </summary>
public class CreateContractPositionRequest
{
    [Required(ErrorMessage = "Position ist erforderlich")]
    public int PositionId { get; set; }

    [Required(ErrorMessage = "Menge ist erforderlich")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Menge muss größer als 0 sein")]
    public decimal Amount { get; set; }
}
