namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Data transfer object for Offer (Angebot) with calculated totals
/// </summary>
public class OfferDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string OfferNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime OfferDate { get; set; }
    public DateTime ValidUntil { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public List<OfferLineItemDto> LineItems { get; set; } = new();
    
    /// <summary>
    /// Calculated total before tax
    /// </summary>
    public decimal NetTotal { get; set; }
    
    /// <summary>
    /// Calculated tax amount
    /// </summary>
    public decimal TaxTotal { get; set; }
    
    /// <summary>
    /// Calculated total including tax
    /// </summary>
    public decimal GrossTotal { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Data transfer object for Offer Line Item
/// </summary>
public class OfferLineItemDto
{
    public int Id { get; set; }
    public int OfferId { get; set; }
    public int? PositionId { get; set; }
    public int LineNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal TaxRate { get; set; }
    
    /// <summary>
    /// Calculated line total before tax
    /// </summary>
    public decimal LineTotal => Quantity * UnitPrice;
    
    /// <summary>
    /// Calculated tax amount for this line
    /// </summary>
    public decimal LineTax => LineTotal * TaxRate / 100;
}

/// <summary>
/// Request model for creating or updating an offer
/// </summary>
public class OfferCreateUpdateDto
{
    public int CustomerId { get; set; }
    public string OfferNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime OfferDate { get; set; }
    public DateTime ValidUntil { get; set; }
    public string Status { get; set; } = "Draft";
    public string? Notes { get; set; }
    public List<OfferLineItemCreateUpdateDto> LineItems { get; set; } = new();
}

/// <summary>
/// Request model for offer line item
/// </summary>
public class OfferLineItemCreateUpdateDto
{
    public int? PositionId { get; set; }
    public int LineNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal TaxRate { get; set; }
}
