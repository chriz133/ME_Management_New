namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a reusable position/service item that can be added to contracts and invoices.
/// This is a catalog of services/products offered by the business.
/// </summary>
public class Position
{
    public int Id { get; set; }
    
    /// <summary>
    /// Name/title of the position
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Detailed description of the service/product
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Unit price for this position (in EUR)
    /// </summary>
    public decimal UnitPrice { get; set; }
    
    /// <summary>
    /// Unit of measurement (e.g., "Stunden", "Stück", "Monat")
    /// </summary>
    public string Unit { get; set; } = string.Empty;
    
    /// <summary>
    /// Tax rate as percentage (e.g., 19.0 for 19% VAT in Germany)
    /// </summary>
    public decimal TaxRate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
}
