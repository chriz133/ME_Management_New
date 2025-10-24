namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a line item in a contract.
/// Links a Position to a Contract with specific quantity and pricing.
/// </summary>
public class ContractPosition
{
    public int Id { get; set; }
    
    /// <summary>
    /// Reference to the contract
    /// </summary>
    public int ContractId { get; set; }
    
    /// <summary>
    /// Reference to the position/service item
    /// </summary>
    public int PositionId { get; set; }
    
    /// <summary>
    /// Quantity of this position in the contract
    /// </summary>
    public decimal Quantity { get; set; }
    
    /// <summary>
    /// Unit price at the time of contract creation (may differ from current Position.UnitPrice)
    /// </summary>
    public decimal UnitPrice { get; set; }
    
    /// <summary>
    /// Tax rate at the time of contract creation
    /// </summary>
    public decimal TaxRate { get; set; }
    
    /// <summary>
    /// Optional description override for this specific contract
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// Line number for ordering in the contract
    /// </summary>
    public int LineNumber { get; set; }
    
    /// <summary>
    /// Navigation property for the contract
    /// </summary>
    public Contract Contract { get; set; } = null!;
    
    /// <summary>
    /// Navigation property for the position
    /// </summary>
    public Position Position { get; set; } = null!;
}
