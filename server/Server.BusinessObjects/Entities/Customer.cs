namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a customer in the business system.
/// Customers can have multiple contracts and invoices.
/// </summary>
public class Customer
{
    public int Id { get; set; }
    
    /// <summary>
    /// Customer company name or full name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Contact email address
    /// </summary>
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// Contact phone number
    /// </summary>
    public string Phone { get; set; } = string.Empty;
    
    /// <summary>
    /// Street address
    /// </summary>
    public string Address { get; set; } = string.Empty;
    
    /// <summary>
    /// City
    /// </summary>
    public string City { get; set; } = string.Empty;
    
    /// <summary>
    /// Postal/ZIP code
    /// </summary>
    public string PostalCode { get; set; } = string.Empty;
    
    /// <summary>
    /// Country
    /// </summary>
    public string Country { get; set; } = string.Empty;
    
    /// <summary>
    /// Tax/VAT identification number
    /// </summary>
    public string TaxId { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Navigation property for related contracts
    /// </summary>
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
    
    /// <summary>
    /// Navigation property for related invoices
    /// </summary>
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
