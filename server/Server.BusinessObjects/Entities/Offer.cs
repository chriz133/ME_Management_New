namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents an offer/quote (Angebot) provided to a customer.
/// Similar to an invoice but represents a proposal rather than a bill.
/// Can be converted into a contract or invoice once accepted.
/// </summary>
public class Offer
{
    public int Id { get; set; }
    
    /// <summary>
    /// Reference to the customer
    /// </summary>
    public int CustomerId { get; set; }
    
    /// <summary>
    /// Offer number for identification (e.g., "AG-2024-001")
    /// </summary>
    public string OfferNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Title/subject of the offer
    /// </summary>
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// Date when the offer was created
    /// </summary>
    public DateTime OfferDate { get; set; }
    
    /// <summary>
    /// Date until which the offer is valid
    /// </summary>
    public DateTime ValidUntil { get; set; }
    
    /// <summary>
    /// Status of the offer
    /// </summary>
    public OfferStatus Status { get; set; } = OfferStatus.Draft;
    
    /// <summary>
    /// Optional notes or terms to display on the offer
    /// </summary>
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Navigation property for the customer
    /// </summary>
    public Customer Customer { get; set; } = null!;
    
    /// <summary>
    /// Navigation property for offer line items
    /// </summary>
    public ICollection<OfferLineItem> LineItems { get; set; } = new List<OfferLineItem>();
}

/// <summary>
/// Status values for offers
/// </summary>
public enum OfferStatus
{
    Draft,
    Sent,
    Accepted,
    Rejected,
    Expired
}
