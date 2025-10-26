using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Request model for updating a contract
/// </summary>
public class UpdateContractRequest
{
    [Required(ErrorMessage = "Kunde ist erforderlich")]
    public int CustomerId { get; set; }

    public bool Accepted { get; set; }

    [Required(ErrorMessage = "Mindestens eine Position ist erforderlich")]
    public List<CreateContractPositionRequest> Positions { get; set; } = new();
}
