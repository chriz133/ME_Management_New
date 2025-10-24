using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Entity mapping to firmaDB 'contract' table
/// Represents a contract in the ME Management system
/// Column names preserved from existing database schema
/// </summary>
[Table("contract")]
public class ContractEntity
{
    [Key]
    [Column("CONTRACT_ID")]
    public int ContractId { get; set; }

    [Column("CUSTOMER_ID")]
    public int? CustomerId { get; set; }

    [Column("PERSON_ID")]
    public int? PersonId { get; set; }

    [Column("POSITION_ID")]
    public int? PositionId { get; set; }

    [Column("START_DATE")]
    public DateTime? StartDate { get; set; }

    [Column("END_DATE")]
    public DateTime? EndDate { get; set; }

    [Column("DESCRIPTION")]
    [MaxLength(255)]
    public string? Description { get; set; }

    // Navigation properties
    [ForeignKey(nameof(CustomerId))]
    public virtual CustomerEntity? Customer { get; set; }

    [ForeignKey(nameof(PersonId))]
    public virtual PersonEntity? Person { get; set; }

    [ForeignKey(nameof(PositionId))]
    public virtual PositionEntity? Position { get; set; }

    public virtual ICollection<InvoiceEntity>? Invoices { get; set; }
}
