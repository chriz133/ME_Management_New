namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents an invoice (Rechnung) issued to a customer.
/// Invoices contain line items and can be generated as PDF documents.
/// </summary>
public class Invoice
{
    public int Id { get; set; }
    
    /// <summary>
    /// Reference to the customer
    /// </summary>
    public int CustomerId { get; set; }
    
    /// <summary>
    /// Optional reference to a contract (if invoice is based on a contract)
    /// </summary>
    public int? ContractId { get; set; }
    
    /// <summary>
    /// Invoice number for identification (e.g., "RE-2024-001")
    /// </summary>
    public string InvoiceNumber { get; set; } = string.Empty;
    
    /// <summary>
    /// Invoice date
    /// </summary>
    public DateTime InvoiceDate { get; set; }
    
    /// <summary>
    /// Due date for payment
    /// </summary>
    public DateTime DueDate { get; set; }
    
    /// <summary>
    /// Status of the invoice
    /// </summary>
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;
    
    /// <summary>
    /// Optional notes or terms to display on the invoice
    /// </summary>
    public string? Notes { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Navigation property for the customer
    /// </summary>
    public Customer Customer { get; set; } = null!;
    
    /// <summary>
    /// Navigation property for the contract (if applicable)
    /// </summary>
    public Contract? Contract { get; set; }
    
    /// <summary>
    /// Navigation property for invoice line items
    /// </summary>
    public ICollection<InvoiceLineItem> LineItems { get; set; } = new List<InvoiceLineItem>();
}

/// <summary>
/// Status values for invoices
/// </summary>
public enum InvoiceStatus
{
    Draft,
    Sent,
    Paid,
    Overdue,
    Cancelled
}
