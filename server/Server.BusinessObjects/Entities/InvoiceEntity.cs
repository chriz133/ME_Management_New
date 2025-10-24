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
        [Column("INVOICE_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InvoiceId { get; set; }

        [Column("CONTRACT_ID")]
        public int? ContractId { get; set; }

        [Column("CUSTOMER_ID")]
        public int? CustomerId { get; set; }

        [Column("CREATION_DATE")]
        public DateTime? CreationDate { get; set; }

        [Column("DUE_DATE")]
        public DateTime? DueDate { get; set; }

        [Column("PAID")]
        public bool? Paid { get; set; }

        // Navigation properties
        [ForeignKey("ContractId")]
        public virtual ContractEntity? Contract { get; set; }

        [ForeignKey("CustomerId")]
        public virtual CustomerEntity? Customer { get; set; }

        public virtual ICollection<InvoicePosition>? InvoicePositions { get; set; }
        public virtual ICollection<FinanceEntity>? FinanceRecords { get; set; }
    }
}
