namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Data transfer object for Invoice with calculated totals
/// </summary>
public class InvoiceDto
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int? ContractId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public List<InvoiceLineItemDto> LineItems { get; set; } = new();
    
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
/// Data transfer object for Invoice Line Item
/// </summary>
public class InvoiceLineItemDto
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
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
/// Request model for creating or updating an invoice
/// </summary>
public class InvoiceCreateUpdateDto
{
    public int CustomerId { get; set; }
    public int? ContractId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public string Status { get; set; } = "Draft";
    public string? Notes { get; set; }
    public List<InvoiceLineItemCreateUpdateDto> LineItems { get; set; } = new();
}

/// <summary>
/// Request model for invoice line item
/// </summary>
public class InvoiceLineItemCreateUpdateDto
{
    public int? PositionId { get; set; }
    public int LineNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public decimal TaxRate { get; set; }
}
