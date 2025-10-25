using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities
{
    /// <summary>
    /// Invoice Position entity - maps to existing 'invoice_position' table in firmaDB
    /// </summary>
    [Table("invoice_position")]
    public class InvoicePosition
    {
        [Key]
        [Column("invoicePositionId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InvoicePositionId { get; set; }

        [Column("amount")]
        public double Amount { get; set; }

        [Column("positionId")]
        public int PositionId { get; set; }

        [Column("invoiceId")]
        public int InvoiceId { get; set; }

        // Navigation properties
        [ForeignKey("InvoiceId")]
        public virtual InvoiceEntity? Invoice { get; set; }

        [ForeignKey("PositionId")]
        public virtual PositionEntity? Position { get; set; }
    }
}
