using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities
{
    /// <summary>
    /// Customer entity - maps to existing 'customer' table in firmaDB
    /// </summary>
    [Table("customer")]
    public class CustomerEntity
    {
        [Key]
        [Column("CUSTOMER_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerId { get; set; }

        [Column("ADDRESS_ID")]
        public int? AddressId { get; set; }

        [Column("NAME")]
        [MaxLength(45)]
        public string? Name { get; set; }

        [Column("EMAIL")]
        [MaxLength(45)]
        public string? Email { get; set; }

        [Column("PHONE")]
        [MaxLength(45)]
        public string? Phone { get; set; }

        [Column("MOBIL")]
        [MaxLength(45)]
        public string? Mobil { get; set; }

        [Column("TAX_NUMBER")]
        [MaxLength(45)]
        public string? TaxNumber { get; set; }

        [Column("FAX")]
        [MaxLength(45)]
        public string? Fax { get; set; }

        [Column("WEBSITE")]
        [MaxLength(45)]
        public string? Website { get; set; }

        // Navigation property
        [ForeignKey("AddressId")]
        public virtual Address? Address { get; set; }

        // Collections
        public virtual ICollection<ContractEntity>? Contracts { get; set; }
        public virtual ICollection<InvoiceEntity>? Invoices { get; set; }
        public virtual ICollection<PersonEntity>? Persons { get; set; }
    }
}
