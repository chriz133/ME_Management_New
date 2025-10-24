namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a line item on an offer (Angebot).
/// Each line item represents a product or service being proposed.
/// </summary>
public class OfferLineItem
{
    public int Id { get; set; }
    
    /// <summary>
    /// Reference to the offer
    /// </summary>
    public int OfferId { get; set; }
    
    /// <summary>
    /// Optional reference to a position (if based on catalog item)
    /// </summary>
    public int? PositionId { get; set; }
    
    /// <summary>
    /// Line number for ordering on the offer
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
    /// Navigation property for the offer
    /// </summary>
    public Offer Offer { get; set; } = null!;
    
    /// <summary>
    /// Navigation property for the position (if applicable)
    /// </summary>
    public Position? Position { get; set; }
}
