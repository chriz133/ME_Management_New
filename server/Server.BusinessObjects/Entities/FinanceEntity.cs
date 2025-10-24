using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Entity mapping to firmaDB 'finance' table
/// Represents financial transactions in the ME Management system
/// Column names preserved from existing database schema
/// </summary>
[Table("finance")]
public class FinanceEntity
{
    [Key]
    [Column("FINANCE_ID")]
    public int FinanceId { get; set; }

    [Column("INVOICE_ID")]
    public int? InvoiceId { get; set; }

    [Column("AMOUNT", TypeName = "decimal(10,2)")]
    public decimal? Amount { get; set; }

    [Column("TRANSACTION_DATE")]
    public DateTime? TransactionDate { get; set; }

    [Column("DESCRIPTION")]
    [MaxLength(255)]
    public string? Description { get; set; }

    [Column("TYPE")]
    [MaxLength(50)]
    public string? Type { get; set; }

    // Navigation properties
    [ForeignKey(nameof(InvoiceId))]
    public virtual InvoiceEntity? Invoice { get; set; }
}
