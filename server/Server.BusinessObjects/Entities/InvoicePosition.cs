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
        [Column("INVOICE_POSITION_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InvoicePositionId { get; set; }

        [Column("INVOICE_ID")]
        public int? InvoiceId { get; set; }

        [Column("POSITION_ID")]
        public int? PositionId { get; set; }

        [Column("QUANTITY")]
        public int? Quantity { get; set; }

        // Navigation properties
        [ForeignKey("InvoiceId")]
        public virtual InvoiceEntity? Invoice { get; set; }

        [ForeignKey("PositionId")]
        public virtual Position? Position { get; set; }
    }
}
