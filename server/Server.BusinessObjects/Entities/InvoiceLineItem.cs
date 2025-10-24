namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a line item on an invoice.
/// Each line item represents a product or service being billed.
/// </summary>
public class InvoiceLineItem
{
    public int Id { get; set; }
    
    /// <summary>
    /// Reference to the invoice
    /// </summary>
    public int InvoiceId { get; set; }
    
    /// <summary>
    /// Optional reference to a position (if based on catalog item)
    /// </summary>
    public int? PositionId { get; set; }
    
    /// <summary>
    /// Line number for ordering on the invoice
    /// </summary>
    public int LineNumber { get; set; }
    
    /// <summary>
    /// Description of the service/product
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Quantity
    /// </summary>
    public decimal Quantity { get; set; }
    
    /// <summary>
    /// Unit of measurement (e.g., "Stunden", "Stück")
    /// </summary>
    public string Unit { get; set; } = string.Empty;
    
    /// <summary>
    /// Unit price (in EUR)
    /// </summary>
    public decimal UnitPrice { get; set; }
    
    /// <summary>
    /// Tax rate as percentage (e.g., 19.0 for 19% VAT)
    /// </summary>
    public decimal TaxRate { get; set; }
    
    /// <summary>
    /// Navigation property for the invoice
    /// </summary>
    public Invoice Invoice { get; set; } = null!;
    
    /// <summary>
    /// Navigation property for the position (if applicable)
    /// </summary>
    public Position? Position { get; set; }
}
