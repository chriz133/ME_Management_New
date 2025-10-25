using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Entity mapping to firmaDB 'contract' table
/// Represents a contract in the ME Management system
/// </summary>
[Table("contract")]
public class ContractEntity
{
    [Key]
    [Column("contractId")]
    public int ContractId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("accepted")]
    public bool Accepted { get; set; }

    [Column("customerId")]
    public int CustomerId { get; set; }

    // Navigation properties
    [ForeignKey(nameof(CustomerId))]
    public virtual CustomerEntity? Customer { get; set; }

    public virtual ICollection<ContractPosition>? ContractPositions { get; set; }
    public virtual ICollection<InvoiceEntity>? Invoices { get; set; }
}
