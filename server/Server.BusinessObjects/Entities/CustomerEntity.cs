using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities
{
    /// <summary>
    /// Customer entity - maps to existing 'customer2' table in firmaDB
    /// </summary>
    [Table("customer2")]
    public class CustomerEntity
    {
        [Key]
        [Column("customerId")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerId { get; set; }

        [Column("firstname")]
        [MaxLength(45)]
        public string? Firstname { get; set; }

        [Column("surname")]
        [MaxLength(45)]
        public string? Surname { get; set; }

        [Column("plz")]
        public int? Plz { get; set; }

        [Column("city")]
        [MaxLength(45)]
        public string? City { get; set; }

        [Column("address")]
        [MaxLength(45)]
        public string? Address { get; set; }

        [Column("nr")]
        public int? Nr { get; set; }

        [Column("uid")]
        [MaxLength(45)]
        public string? Uid { get; set; }

        // Collections
        public virtual ICollection<ContractEntity>? Contracts { get; set; }
        public virtual ICollection<InvoiceEntity>? Invoices { get; set; }
    }
}
