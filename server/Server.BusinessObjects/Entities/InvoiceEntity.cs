using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities
{
    /// <summary>
    /// Invoice entity - maps to existing 'invoice' table in firmaDB
    /// </summary>
    [Table("invoice")]
    public class InvoiceEntity
    {
        [Key]
        [Column("invoiceId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InvoiceId { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("customerId")]
        public int CustomerId { get; set; }

        [Column("started_at")]
        public DateTime StartedAt { get; set; }

        [Column("finished_at")]
        public DateTime FinishedAt { get; set; }

        [Column("deposit_amount")]
        public double DepositAmount { get; set; }

        [Column("deposit_paid_on")]
        public DateTime DepositPaidOn { get; set; }

        [Column("type")]
        [MaxLength(1)]
        public string? Type { get; set; }

        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual CustomerEntity? Customer { get; set; }

        public virtual ICollection<InvoicePosition>? InvoicePositions { get; set; }
    }
}
