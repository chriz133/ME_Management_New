using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Transaction entity - maps to 'transaction' table in firmaDB
/// Represents a financial transaction
/// </summary>
[Table("transaction")]
public class TransactionEntity
{
    [Key]
    [Column("transactionId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int TransactionId { get; set; }

    [Column("amount")]
    public double Amount { get; set; }

    [Column("description")]
    [MaxLength(45)]
    public string? Description { get; set; }

    [Column("date")]
    public DateTime Date { get; set; }

    [Column("type")]
    [MaxLength(1)]
    public string? Type { get; set; }

    [Column("medium")]
    [MaxLength(20)]
    public string? Medium { get; set; }
}
