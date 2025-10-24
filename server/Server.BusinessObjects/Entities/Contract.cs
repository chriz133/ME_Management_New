namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a contract/agreement with a customer.
/// Contracts can contain multiple positions and lead to invoices.
/// </summary>
public class Contract
{
    public int Id { get; set; }
    
    /// <summary>
    /// Reference to the customer
    /// </summary>
    public int CustomerId { get; set; }
    
    /// <summary>
    /// Contract number for identification
    /// </summary>
    public string ContractNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Title/subject of the contract
    /// </summary>
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// Detailed description
    /// </summary>
    public string Description { get; set; } = string.Empty;
    
    /// <summary>
    /// Start date of the contract
    /// </summary>
    public DateTime StartDate { get; set; }
    
    /// <summary>
    /// End date of the contract (nullable for open-ended contracts)
    /// </summary>
    public DateTime? EndDate { get; set; }
    
    /// <summary>
    /// Current status of the contract
    /// </summary>
    public ContractStatus Status { get; set; } = ContractStatus.Draft;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Navigation property for the customer
    /// </summary>
    public Customer Customer { get; set; } = null!;
    
    /// <summary>
    /// Navigation property for contract positions
    /// </summary>
    public ICollection<ContractPosition> Positions { get; set; } = new List<ContractPosition>();
}

/// <summary>
/// Status values for contracts
/// </summary>
public enum ContractStatus
{
    Draft,
    Active,
    Completed,
    Cancelled
}
